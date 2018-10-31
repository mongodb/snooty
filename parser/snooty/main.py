import collections
import getpass
import logging
import multiprocessing
import os
import pwd
import subprocess
import sys
import docutils.nodes
import pymongo
import watchdog.events
import watchdog.observers
from functools import partial
from typing import Any, Callable, Dict, Iterator, Optional, Tuple, Set, List
import docutils.utils

from . import gizaparser
from .types import SerializableType, EmbeddedRstParser, Page, StaticAsset, ParseWarning
from .parser import Visitor, Parser

logger = logging.getLogger(__name__)


def reroot_path(filename: str, docpath: str, project_root: str) -> Tuple[str, str]:
    """Files within a project may refer to other files. Return a canonical path
       relative to the project root."""
    if filename.startswith('/'):
        rel_fn = filename[1:]
    else:
        rel_fn = os.path.normpath(os.path.join(os.path.dirname(docpath), filename))
    return rel_fn, os.path.abspath(os.path.join(project_root, rel_fn))


def get_files(root: str, extensions: Set[str]) -> Iterator[str]:
    """Recursively iterate over files underneath the given root, yielding
       only filenames with the given extensions."""
    for root, dirs, files in os.walk(root):
        for name in files:
            ext = os.path.splitext(name)[1]

            if ext not in extensions:
                continue

            yield os.path.join(root, name)


def get_line(node: docutils.nodes.Node) -> int:
    """Return the first line number we can find in node's ancestry."""
    while node.line is None:
        if node.parent is None:
            # This is probably a document node
            return 0
        node = node.parent

    return node.line


class JSONVisitor(Visitor):
    """Node visitor that creates a JSON-serializable structure."""
    def __init__(self, project_root: str, docpath: str, document: docutils.nodes.document) -> None:
        self.project_root = project_root
        self.docpath = docpath
        self.document = document
        self.state: List[Dict[str, Any]] = []
        self.warnings: List[Tuple[str, int]] = []
        self.static_assets: Set[StaticAsset] = set()

    def dispatch_visit(self, node: docutils.nodes.Node) -> None:
        node_name = node.__class__.__name__
        if node_name == 'system_message':
            msg = node[0].astext()
            self.warnings.append((msg, get_line(node)))
            raise docutils.nodes.SkipNode()
        elif node_name in ('definition', 'field_list'):
            return

        if node_name == 'document':
            self.state.append({
                'type': 'root',
                'children': [],
                'position': {
                    'start': {'line': 0}
                }
            })
            return

        doc: Dict[str, SerializableType] = {
            'type': node_name,
            'position': {
                'start': {'line': get_line(node)}
            }
        }

        if node_name == 'field':
            key = node.children[0].astext()
            value = node.children[1].astext()
            self.state[-1].setdefault('options', {})[key] = value
            raise docutils.nodes.SkipNode()

        self.state.append(doc)

        if node_name == 'Text':
            doc['type'] = 'text'
            doc['value'] = str(node)
            return

        # Most, but not all, nodes have children nodes
        make_children = True

        if node_name == 'directive':
            self.handle_directive(node, doc)
        elif node_name == 'role':
            doc['name'] = node['name']
            doc['label'] = node['label']
            doc['target'] = node['target']
            doc['raw'] = node['raw']
        elif node_name == 'target':
            doc['type'] = 'target'
            doc['ids'] = node['ids']
            make_children = False
        elif node_name == 'definition_list':
            doc['type'] = 'definitionList'
        elif node_name == 'definition_list_item':
            doc['type'] = 'definitionListItem'
            doc['term'] = []
        elif node_name == 'bullet_list':
            doc['type'] = 'list'
            doc['ordered'] = False
        elif node_name == 'enumerated_list':
            doc['type'] = 'list'
            doc['ordered'] = True
        elif node_name == 'list_item':
            doc['type'] = 'listItem'
        elif node_name == 'title':
            doc['type'] = 'heading'
        elif node_name == 'FixedTextElement':
            doc['type'] = 'literal'
            doc['value'] = node.astext()
            make_children = False

        if make_children:
            doc['children'] = []

    def dispatch_departure(self, node: docutils.nodes.Node) -> None:
        node_name = node.__class__.__name__
        if len(self.state) == 1 or node_name == 'definition':
            return

        popped = self.state.pop()

        if popped['type'] == 'term':
            self.state[-1]['term'] = popped['children']
        else:
            if 'children' not in self.state[-1]:
                print(self.state[-1])
            self.state[-1]['children'].append(popped)

    def handle_directive(self, node: docutils.nodes.Node, doc: Dict[str, SerializableType]) -> None:
        name = node['name']
        doc['name'] = name

        if node.children and node.children[0].__class__.__name__ == 'directive_argument':
            visitor = JSONVisitor(self.project_root, self.docpath, self.document)
            node.children[0].walkabout(visitor)
            argument = visitor.state[-1]['children']
            doc['argument'] = argument
            options = node['options']
            doc['options'] = options
            node.children = node.children[1:]
        else:
            argument = []
            options = {}
            doc['argument'] = argument

        argument_text = None
        try:
            argument_text = argument[0]['value']
        except (IndexError, KeyError):
            pass

        if name == 'figure':
            if argument_text is None:
                self.warnings.append(('"figure" expected a path argument', get_line(node)))
                return

            try:
                static_asset = self.add_static_asset(argument_text)
                options = static_asset.checksum
            except OSError as err:
                msg = '"figure" could not open "{}": {}'.format(
                    argument_text, os.strerror(err.errno))
                self.warnings.append((msg, get_line(node)))

    def add_static_asset(self, path: str) -> StaticAsset:
        fileid, path = reroot_path(path, self.docpath, self.project_root)
        static_asset = StaticAsset.load(fileid, path)
        self.static_assets.add(static_asset)
        return static_asset


class InlineJSONVisitor(JSONVisitor):
    """A JSONVisitor subclass which does not emit block nodes."""
    def dispatch_visit(self, node: docutils.nodes.Node) -> None:
        if isinstance(node, docutils.nodes.Body):
            return

        JSONVisitor.dispatch_visit(self, node)

    def dispatch_departure(self, node: docutils.nodes.Node) -> None:
        if isinstance(node, docutils.nodes.Body):
            return

        JSONVisitor.dispatch_departure(self, node)


def step_to_page(page: Page,
                 step: gizaparser.steps.Step,
                 rst_parser: EmbeddedRstParser) -> SerializableType:
    rendered = step.render(page, rst_parser)
    return {
        'type': 'directive',
        'name': 'step',
        'position': {'start': {'line': step.__line__}},
        'children': [rendered]
    }


def steps_to_page(page: Page,
                  steps: List[gizaparser.steps.Step],
                  rst_parser: EmbeddedRstParser) -> SerializableType:
    return {
        'type': 'directive',
        'name': 'steps',
        'position': {'start': {'line': 0}},
        'children': [step_to_page(page, step, rst_parser) for step in steps]
    }


def parse(parser: Parser[JSONVisitor], path: str) -> Page:
    if path.endswith('.txt') or path.endswith('.rst'):
        with open(path, 'r') as f:
            text = f.read()
        visitor = parser.parse(path, text)

        return Page(
            path,
            text,
            visitor.state[-1],
            visitor.warnings,
            visitor.static_assets)

    if path.endswith('.yaml'):
        page = Page(path, '', {}, [], set())
        rst_parser = make_embedded_rst_parser(parser.project_root, page)
        filename = os.path.basename(path)

        if filename.startswith('steps-'):
            steps, text = gizaparser.parse(path, gizaparser.steps.Step)
            page.source = text
            page.ast = steps_to_page(page, steps, rst_parser)
            return page

    raise Exception('Unknown file type: ' + path)


def make_embedded_rst_parser(project_root: str, page: Page) -> EmbeddedRstParser:
    def parse_embedded_rst(rst: str,
                           lineno: int,
                           inline: bool) -> List[SerializableType]:
        # Crudely make docutils line numbers match
        text = '\n' * lineno + rst.strip()
        visitor_class = InlineJSONVisitor if inline else JSONVisitor
        parser = Parser(project_root, visitor_class)
        visitor = parser.parse(page.path, text)
        children: List[SerializableType] = visitor.state[-1]['children']

        page.warnings.extend(visitor.warnings)
        page.static_assets.update(visitor.static_assets)

        return children

    return parse_embedded_rst


class Project:
    def __init__(self,
                 name: str,
                 root: str,
                 client: pymongo.MongoClient,
                 progress_callback: Optional[Callable[[int, int, str], None]]=None,
                 warning_callback: Optional[Callable[[List[ParseWarning]], None]]=None) -> None:
        self.name = name
        self.root = root
        self.client = client
        self.parser = Parser(self.root, JSONVisitor)
        self.static_assets: Dict[str, Set[StaticAsset]] = collections.defaultdict(set)

        self.progress = progress_callback if progress_callback else lambda cur, total, status: None
        self.warning = warning_callback if warning_callback else lambda warnings: None

        username = pwd.getpwuid(os.getuid()).pw_name
        branch = subprocess.check_output(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            encoding='utf-8').strip()
        self.prefix = [self.name, username, branch]

    def get_page_id(self, path: str) -> str:
        return '/'.join(self.prefix + [path.split('.')[0].split('/', 1)[1]])

    def update(self, path: str) -> None:
        page = parse(self.parser, path)
        self._update(page)
        self.warning(list((path, msg, lineno) for msg, lineno in page.warnings))

    def _update(self, page: Page) -> None:
        page_id = self.get_page_id(page.path)
        checksums = list(asset.checksum for asset in page.static_assets)
        self.client['snooty']['documents'].replace_one({'_id': page_id}, {
            '_id': page_id,
            'prefix': self.prefix,
            'ast': page.ast,
            'source': page.source,
            'static_assets': checksums
        }, upsert=True)

        remote_assets = set(doc['_id'] for doc in self.client['snooty']['assets'].find(
            {'_id': {'$in': checksums}},
            {'_id': True},
            cursor_type=pymongo.cursor.CursorType.EXHAUST))
        missing_assets = page.static_assets.difference(remote_assets)

        for static_asset in missing_assets:
            self.client['snooty']['assets'].replace_one({'_id': static_asset.checksum}, {
                '_id': static_asset.checksum,
                'type': os.path.splitext(static_asset.fileid)[1],
                'data': static_asset.data
            }, upsert=True)

    def delete(self, path: str) -> None:
        page_id = self.get_page_id(path)
        self.client['snooty']['documents'].delete_one({'_id': page_id})

    def build(self) -> None:
        logging.info('Building %s', self.name)
        with multiprocessing.Pool() as pool:
            paths = get_files(self.root, {'.rst', '.txt', '.yaml'})
            for page in pool.imap(partial(parse, self.parser), paths):
                self._update(page)
                if page.warnings:
                    warnings = ((page.path, msg, lineno) for msg, lineno in page.warnings)
                    self.warning(list(warnings))


class ObserveHandler(watchdog.events.PatternMatchingEventHandler):
    def __init__(self, project: Project) -> None:
        super(ObserveHandler, self).__init__(patterns=['*.rst', '*.txt', '*.yaml'])
        self.project = project

    def dispatch(self, event: watchdog.events.FileSystemEvent) -> None:
        if event.is_directory:
            return

        if event.event_type in (watchdog.events.EVENT_TYPE_CREATED,
                                watchdog.events.EVENT_TYPE_MODIFIED):
            logging.info('Rebuilding %s', event.src_path)
            self.project.update(event.src_path)
        elif event.event_type == watchdog.events.EVENT_TYPE_DELETED:
            logging.info('Deleting %s', event.src_path)
            self.project.delete(event.src_path)
        elif isinstance(event, watchdog.events.FileSystemMovedEvent):
            logging.info('Moving %s', event.src_path)
            self.project.delete(event.src_path)
            self.project.update(event.dest_path)
        else:
            assert False


def log_warning(warnings: List[ParseWarning]) -> None:
    for path, msg, lineno in warnings:
        # Line numbers are currently... uh, "approximate"
        print('WARNING({}:{}ish): {}'.format(path, lineno, msg))


def usage(exit_code: int) -> None:
    """Exit and print usage information."""
    print('Usage: {} <build|watch> <mongodb-url> <source-path>'.format(sys.argv[0]))
    sys.exit(exit_code)


def main() -> None:
    logging.basicConfig(level=logging.INFO)

    if len(sys.argv) != 4 or sys.argv[1] not in ('watch', 'build'):
        usage(1)

    url = sys.argv[2]
    connection = pymongo.MongoClient(url, password=getpass.getpass())
    root_path = sys.argv[3]
    project = Project('guides', root_path, connection, warning_callback=log_warning)
    project.build()

    if sys.argv[1] == 'watch':
        observer = watchdog.observers.Observer()
        handler = ObserveHandler(project)
        logger.info('Watching for changes...')
        observer.schedule(handler, root_path, recursive=True)
        observer.start()
        observer.join()
