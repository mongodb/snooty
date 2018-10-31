import yaml
from yaml.composer import Composer
from yaml.constructor import Constructor
from typing import Dict, List, Tuple, Type, TypeVar
from .flutter import check_type, LoadError
from ..types import SerializableType
from . import steps  # NoQA

T = TypeVar('T')


class ParseError(Exception):
    pass


def load_yaml(text: str) -> List[SerializableType]:
    loader = yaml.Loader(text)

    def compose_node(parent: yaml.nodes.Node, index: int) -> yaml.nodes.Node:
        # the line number where the previous token has ended (plus empty lines)
        line = loader.line
        node = Composer.compose_node(loader, parent, index)
        node.__line__ = line + 1
        return node

    def construct_mapping(node: yaml.nodes.Node, deep: bool=False) -> Dict:
        mapping = Constructor.construct_mapping(loader, node, deep=deep)
        mapping['__line__'] = node.__line__
        return mapping

    setattr(loader, 'compose_node', compose_node)
    setattr(loader, 'construct_mapping', construct_mapping)
    result: List[SerializableType] = []
    while True:
        data = loader.get_data()
        if data:
            result.append(data)
        else:
            break

    return result


def parse(path: str, ty: Type[T]) -> Tuple[List[T], str]:
    with open(path, 'r') as f:
        text = f.read()

    parsed_yaml = load_yaml(text)

    try:
        parsed = [check_type(ty, data) for data in parsed_yaml]
        return parsed, text
    except LoadError as err:
        raise ParseError(str(err))
