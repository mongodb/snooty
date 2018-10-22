import abc
import re
import docutils.frontend
import docutils.nodes
import docutils.parsers.rst
import docutils.parsers.rst.directives
import docutils.parsers.rst.roles
import docutils.parsers.rst.states
import docutils.statemachine
import docutils.utils
from typing import Callable, Dict, Generic, Optional, List, Tuple, Type, TypeVar

PAT_EXPLICIT_TILE = re.compile(r'^(?P<label>.+?)\s*(?<!\x00)<(?P<target>.*?)>$', re.DOTALL)
PAT_WHITESPACE = re.compile(r'^\x20*')
SPECIAL_DIRECTIVES = {'code-block', 'include', 'tabs-drivers', 'tabs', 'tabs-platforms', 'only'}


class directive_argument(docutils.nodes.General, docutils.nodes.TextElement):
    pass


class directive(docutils.nodes.General, docutils.nodes.Element):
    def __init__(self, name: str) -> None:
        super(directive, self).__init__()
        self['name'] = name


class role(docutils.nodes.General, docutils.nodes.Inline, docutils.nodes.Element):
    def __init__(self, name: str, rawtext: str, text: str, lineno: int) -> None:
        super(role, self).__init__()
        self['name'] = name
        self['raw'] = text

        match = PAT_EXPLICIT_TILE.match(text)
        if match:
            self['label'] = {
                'type': 'text',
                'value': match['label'],
                'position': {'start': {'line': lineno}}
            }
            self['target'] = match['target']
        else:
            self['label'] = text
            self['target'] = text


def parse_options(block_text: str) -> Dict[str, str]:
    """Docutils doesn't parse directive options that aren't known ahead
       of time. Do it ourselves, badly."""
    lines = block_text.split('\n')
    current_key: Optional[str] = None
    kv: Dict[str, str] = {}
    base_indentation = 0

    for i, line in enumerate(lines):
        if i == 0:
            continue

        stripped = line.strip()
        if not stripped:
            continue

        whitespace_match = PAT_WHITESPACE.match(line)
        assert whitespace_match is not None
        indentation = len(whitespace_match.group(0))

        if base_indentation == 0:
            base_indentation = indentation

        match = re.match(docutils.parsers.rst.states.Body.patterns['field_marker'], stripped)
        if match:
            current_key = match.group(0)
            assert current_key is not None
            value = stripped[len(current_key):]
            current_key = current_key.strip().strip(':')
            kv[current_key] = value
            continue

        if indentation == base_indentation:
            break
        elif current_key:
            kv[current_key] += '\n' + line[indentation:]

    return kv


class Directive(docutils.parsers.rst.Directive):
    optional_arguments = 1
    final_argument_whitespace = True
    has_content = True

    def run(self) -> List[docutils.nodes.Node]:
        messages: List[docutils.nodes.Node] = []
        source, line = self.state_machine.get_source_and_line(self.lineno)

        node = directive(self.name)
        node.document = self.state.document
        node.source, node.line = source, line
        self.add_name(node)

        # Parse the argument (i.e. what's after the colon on the 0th line)
        if self.arguments:
            argument_text = self.arguments[0].split('\n')[0]
            textnodes, messages = self.state.inline_text(argument_text, self.lineno)
            argument = directive_argument(argument_text, '', *textnodes)
            argument.document = self.state.document
            argument.source, argument.line = source, line
            node.append(argument)

        # Parse options
        node['options'] = parse_options(self.block_text)

        # Parse the content
        if self.name in SPECIAL_DIRECTIVES:
            raw = docutils.nodes.FixedTextElement()
            raw.document = self.state.document
            raw.source, raw.line = source, line
            node.append(raw)
        else:
            self.state.nested_parse(self.content, self.state_machine.line_offset, node)

        return [node]


def handle_role(typ: str, rawtext: str, text: str,
                lineno: int, inliner: object,
                options: Dict={}, content: List=[]) -> Tuple[List, List]:
    node = role(typ, rawtext, text, lineno)
    return [node], []


def lookup_directive(directive_name: str, language_module: object,
                     document: docutils.nodes.document) -> Tuple[Type, List]:
    return Directive, []


def lookup_role(role_name: str, language_module: object, lineno: int,
                reporter: object) -> Tuple[Optional[Callable], List]:
    return handle_role, []


docutils.parsers.rst.directives.directive = lookup_directive
docutils.parsers.rst.roles.role = lookup_role


class NoTransformRstParser(docutils.parsers.rst.Parser):
    def get_transforms(self) -> List:
        return []


class Visitor(metaclass=abc.ABCMeta):
    def __init__(self, document: docutils.nodes.document) -> None: pass

    @abc.abstractmethod
    def dispatch_visit(self, node: docutils.nodes.Node) -> None:
        pass

    @abc.abstractmethod
    def dispatch_departure(self, node: docutils.nodes.Node) -> None:
        pass


V = TypeVar('V', bound=Visitor)


class Parser(Generic[V]):
    __slots__ = ('visitor_class', 'directives')

    def __init__(self, visitor_class: Type[V]) -> None:
        self.visitor_class = visitor_class

    def parse(self, path: str, text: str) -> V:
        parser = NoTransformRstParser()
        settings = docutils.frontend.OptionParser(
            components=(docutils.parsers.rst.Parser,)
            ).get_default_values()
        settings.report_level = docutils.utils.Reporter.SEVERE_LEVEL
        document = docutils.utils.new_document(path, settings)
        parser.parse(text, document)

        visitor = self.visitor_class(document)
        document.walkabout(visitor)
        return visitor
