import abc
import re
import docutils.frontend
import docutils.nodes
import docutils.parsers.rst
import docutils.parsers.rst.roles
import docutils.parsers.rst.directives
import docutils.statemachine
import docutils.utils
from typing import Callable, Dict, Generic, Optional, List, Tuple, Type, TypeVar

PAT_EXPLICIT_TILE = re.compile(r'^(?P<label>.+?)\s*(?<!\x00)<(?P<target>.*?)>$', re.DOTALL)
SPECIAL_DIRECTIVES = {'code-block', 'include', 'tabs-drivers', 'tabs', 'tabs-platforms', 'only'}


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


class Directive(docutils.parsers.rst.Directive):
    optional_arguments = 0
    final_argument_whitespace = True
    option_spec: Dict[str, object] = {}
    has_content = True

    def run(self) -> List[docutils.nodes.Node]:
        node = directive(self.name)
        node.document = self.state.document
        node.source, node.line = self.state_machine.get_source_and_line(self.lineno)
        self.add_name(node)
        if self.name not in SPECIAL_DIRECTIVES:
            self.state.nested_parse(self.content, self.content_offset, node)

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
