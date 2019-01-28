import logging
import yaml
import yaml.resolver
import yaml.scanner
from pathlib import Path
from typing import List, Optional, Tuple, Type, TypeVar
from yaml.composer import Composer
from ..flutter import check_type, LoadError, mapping_dict
from ..types import Diagnostic, SerializableType, ProjectConfig

_T = TypeVar('_T')
logger = logging.getLogger(__name__)


class ParseError(Exception):
    def __init__(self, diagnostic: Diagnostic) -> None:
        super(ParseError, self).__init__(diagnostic.message)
        self.diagnostic = diagnostic


def load_yaml(text: str) -> List[SerializableType]:
    class MyLoader(yaml.SafeLoader):
        def compose_node(self, parent: yaml.nodes.Node, index: int) -> yaml.nodes.Node:
            # the line number where the previous token has ended (plus empty lines)
            line = self.line
            node = Composer.compose_node(self, parent, index)
            node._start_line = line + 1
            return node

    def dict_constructor(loader: yaml.Loader, node: yaml.nodes.Node) -> mapping_dict:
        mapping = mapping_dict(loader.construct_pairs(node))
        mapping._start_line = node._start_line
        return mapping

    loader = MyLoader(text)
    loader.add_constructor(
        yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
        dict_constructor)
    result: List[SerializableType] = []
    while True:
        data = loader.get_data()
        if data:
            result.append(data)
        else:
            break

    return result


def parse(ty: Type[_T],
          path: Path,
          project_config: ProjectConfig,
          text: Optional[str] = None) -> Tuple[List[_T], str, List[Diagnostic]]:
    diagnostics: List[Diagnostic] = []
    if text is None:
        text, diagnostics = project_config.read(path)

    try:
        parsed_yaml = load_yaml(text)
    except yaml.scanner.ScannerError as err:
        lineno = err.problem_mark.line
        col = err.problem_mark.column
        return [], text, diagnostics + [Diagnostic.error(err.problem, (lineno, col))]

    try:
        parsed = [check_type(ty, data) for data in parsed_yaml]
        return parsed, text, diagnostics
    except LoadError as err:
        mapping = err.bad_data if isinstance(err.bad_data, dict) else {}
        lineno = mapping._start_line if isinstance(mapping, mapping_dict) else 0
        return [], text, diagnostics + [Diagnostic.error(str(err), lineno)]
