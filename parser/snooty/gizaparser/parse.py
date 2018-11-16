import logging
import yaml
import yaml.scanner
from pathlib import PurePath
from typing import Dict, List, Optional, Tuple, Type, TypeVar
from yaml.composer import Composer
from yaml.constructor import Constructor
from ..flutter import check_type, LoadError
from ..types import Diagnostic, SerializableType

_T = TypeVar('_T')
logger = logging.getLogger(__name__)


class ParseError(Exception):
    def __init__(self, diagnostic: Diagnostic) -> None:
        super(ParseError, self).__init__(diagnostic.message)
        self.diagnostic = diagnostic


def load_yaml(text: str) -> List[SerializableType]:
    loader = yaml.Loader(text)

    def compose_node(parent: yaml.nodes.Node, index: int) -> yaml.nodes.Node:
        # the line number where the previous token has ended (plus empty lines)
        line = loader.line
        node = Composer.compose_node(loader, parent, index)
        node.__line__ = line + 1
        return node

    def construct_mapping(node: yaml.nodes.Node, deep: bool = False) -> Dict:
        mapping = Constructor.construct_mapping(loader, node, deep=deep)
        mapping['__line__'] = node.__line__
        return mapping

    loader.compose_node = compose_node  # type: ignore
    loader.construct_mapping = construct_mapping  # type: ignore
    result: List[SerializableType] = []
    while True:
        data = loader.get_data()
        if data:
            result.append(data)
        else:
            break

    return result


def parse(ty: Type[_T],
          path: PurePath,
          text: Optional[str] = None) -> Tuple[List[_T], str, List[Diagnostic]]:
    if text is None:
        with open(path, 'r') as f:
            text = f.read()

    try:
        parsed_yaml = load_yaml(text)
    except yaml.scanner.ScannerError as err:
        lineno = err.problem_mark.line
        col = err.problem_mark.column
        return [], text, [Diagnostic.error(err.problem, (lineno, col))]

    try:
        parsed = [check_type(ty, data) for data in parsed_yaml]
        return parsed, text, []
    except LoadError as err:
        mapping = err.bad_data if isinstance(err.bad_data, dict) else {}
        lineno = mapping.get('__line__', 0)
        return [], text, [Diagnostic.error(str(err), lineno)]
