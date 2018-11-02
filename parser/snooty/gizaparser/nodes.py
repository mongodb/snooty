import collections
import dataclasses
import logging
import os.path
import re
from dataclasses import dataclass
from typing import Callable, Dict, Set, Generic, Optional, TypeVar, Tuple, Iterator, Sequence
from .flutter import checked
from ..types import Page, EmbeddedRstParser

PAT_SUBSTITUTION = re.compile(r'\{\{([\w-]+)\}\}')
logger = logging.getLogger(__name__)


def substitute(text: str, replacements: Dict[str, str]) -> str:
    return PAT_SUBSTITUTION.sub(lambda match: replacements[match.group(1)], text)


@checked
@dataclass
class Node:
    __line__: int


@checked
@dataclass
class Inherit(Node):
    file: str
    ref: str


@dataclass
class Inheritable:
    ref: Optional[str]
    replacement: Optional[Dict[str, str]]

    source: Optional[Inherit]
    inherit: Optional[Inherit]


T = TypeVar('T', bound=Inheritable)


def inherit(obj: T, parent: T) -> T:
    logger.debug('Inheriting %s', obj.ref)
    changes: Dict[str, object] = {}

    # Inherit root-level keys
    for field_name in (field.name for field in dataclasses.fields(parent)
                       if getattr(obj, field.name) is None):
        new_value = getattr(parent, field_name)
        if new_value is not None:
            changes[field_name] = new_value

    # Inherit replacements
    replacement = obj.replacement.copy() if obj.replacement is not None else {}
    changes['replacement'] = replacement
    if parent.replacement is not None:
        for src, dest in parent.replacement.items():
            if src not in replacement:
                replacement[src] = dest

    return dataclasses.replace(obj, **changes)


@dataclass
class GizaNode(Generic[T]):
    __slots__ = ('path', 'text', 'data')

    path: str
    text: str
    data: Sequence[T]


class DependencyGraph:
    __slots__ = ('dependencies', 'dependents')

    def __init__(self) -> None:
        self.dependents: Dict[str, Set[str]] = collections.defaultdict(set)
        self.dependencies: Dict[str, Set[str]] = collections.defaultdict(set)

    def set_dependencies(self, obj: str, dependencies: Set[str]) -> None:
        for dependency in self.dependencies[obj]:
            self.dependents[dependency].remove(obj)
        self.dependencies[obj] = dependencies
        for dependency in dependencies:
            self.dependents[dependency].add(obj)


class Registry(Generic[T]):
    def __init__(self) -> None:
        self.nodes: Dict[str, GizaNode] = {}
        self.dg = DependencyGraph()

    def add(self, path: str, text: str, elements: Sequence[T]) -> None:
        node_id = os.path.basename(path)
        self.nodes[node_id] = GizaNode(path, text, elements)
        dependencies = set()
        for element in elements:
            inherit = None
            if element.source:
                inherit = element.source
            elif element.inherit:
                inherit = element.inherit

            if not inherit:
                continue

            dependencies.add(inherit.file)

        self.dg.set_dependencies(node_id, dependencies)

    def reify(self, obj: T) -> T:
        parent_identifier = obj.source if obj.source is not None else obj.inherit
        if parent_identifier is not None:
            parent_sequence = self.nodes[parent_identifier.file].data
            parent: T = next(x for x in parent_sequence if x.ref == parent_identifier.ref)
            obj.ref = parent.ref
            reified = inherit(obj, parent)
            return reified

        return obj

    def reify_node_id(self, node_id: str) -> GizaNode[T]:
        node = self.nodes[node_id]
        return dataclasses.replace(node, data=[self.reify(el) for el in node.data])

    def __iter__(self) -> Iterator[Tuple[str, GizaNode[T]]]:
        yield from (
            (node_id, dataclasses.replace(node, data=[self.reify(el) for el in node.data]))
            for node_id, node in self.nodes.items())

    def __len__(self) -> int:
        return len(self.nodes)


@dataclass
class GizaCategory(Generic[T]):
    registry: Registry[T]
    parse: Callable[[str], Tuple[Sequence[T], str]]
    to_page: Callable[[Page, Sequence[T], EmbeddedRstParser], None]
