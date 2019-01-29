import collections
import dataclasses
import logging
import re
from dataclasses import dataclass, field
from pathlib import Path, PurePath
from typing import cast, Callable, Dict, Set, Generic, Optional, \
                   TypeVar, Tuple, Iterator, Sequence, List, Union
from ..flutter import checked
from ..types import Diagnostic, Page, EmbeddedRstParser, SerializableType, ProjectConfig

_T = TypeVar('_T', str, object)
PAT_SUBSTITUTION = re.compile(r'\{\{([\w-]+)\}\}')
logger = logging.getLogger(__name__)


def substitute_text(text: str, replacements: Dict[str, str]) -> str:
    return PAT_SUBSTITUTION.sub(lambda match: replacements.get(match.group(1), ''), text)


def substitute(obj: _T, replacements: Dict[str, str]) -> _T:
    if isinstance(obj, str):
        return substitute_text(obj, replacements)

    if not dataclasses.is_dataclass(obj):
        return obj

    changes: Dict[str, object] = {}
    for obj_field in dataclasses.fields(obj):
        value = getattr(obj, obj_field.name)
        if isinstance(value, str):
            new_str = substitute_text(value, replacements)
            if new_str is not value:
                changes[obj_field.name] = new_str
        elif dataclasses.is_dataclass(value):
            new_value = substitute(value, replacements)
            if new_value is not value:
                changes[obj_field.name] = new_value

    return dataclasses.replace(obj, **changes) if changes else obj


class Node:
    @property
    def line(self) -> int:
        return cast(int, getattr(self, '_start_line', 0))


@checked
@dataclass
class Inherit(Node):
    file: str
    ref: str


@dataclass
class Inheritable(Node):
    ref: Optional[str]
    replacement: Optional[Dict[str, str]]

    source: Optional[Inherit]
    inherit: Optional[Inherit]


_I = TypeVar('_I', bound=Inheritable)


def inherit(obj: _I, parent: Optional[_I]) -> _I:
    logger.debug('Inheriting %s', obj.ref)
    changes: Dict[str, object] = {}

    # Inherit replacements
    replacement = obj.replacement.copy() if obj.replacement is not None else {}
    changes['replacement'] = replacement
    if parent is not None and parent.replacement is not None:
        for src, dest in parent.replacement.items():
            if src not in replacement:
                replacement[src] = dest

    # Inherit root-level keys
    for field_name in (field.name for field in dataclasses.fields(obj)
                       if field.name not in {'replacement', 'ref', 'source', 'inherit'}):
        value = getattr(obj, field_name)
        if parent is not None and value is None:
            new_value = getattr(parent, field_name)
            if new_value is not None:
                changes[field_name] = new_value
                value = new_value

        if replacement and value is not None:
            changes[field_name] = substitute(value, replacement)

    return dataclasses.replace(obj, **changes) if changes else obj


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

    def __delitem__(self, obj: str) -> None:
        pass


@dataclass
class GizaFile(Generic[_I]):
    """A GizaFile represents a single Giza YAML file."""
    __slots__ = ('path', 'text', 'data')

    path: Path
    text: str
    data: Sequence[_I]


@dataclass
class GizaCategory(Generic[_I]):
    """A GizaCategory stores metadata about a "category" of Giza YAML files. For
       example, "steps", or "apiargs". Each GizaCategory contains all types necessary
       to transform a given path into Pages."""
    project_config: ProjectConfig
    nodes: Dict[str, GizaFile[_I]] = field(default_factory=dict)
    dg: DependencyGraph = field(default_factory=DependencyGraph)

    def parse(self,
              path: Path,
              text: Optional[str] = None) -> Tuple[Sequence[_I], str, List[Diagnostic]]:
        pass

    def to_pages(self,
                 page_factory: Callable[[], Tuple[Page, EmbeddedRstParser]],
                 data: Sequence[_I]) -> List[Page]:
        pass

    def add(self, path: Path, text: str, elements: Sequence[_I]) -> None:
        file_id = path.name
        self.nodes[file_id] = GizaFile(path, text, elements)
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

        self.dg.set_dependencies(file_id, dependencies)

    def reify(self, obj: _I, diagnostics: List[Diagnostic]) -> _I:
        parent_identifier = obj.source if obj.source is not None else obj.inherit
        parent: Optional[_I] = None
        if parent_identifier is not None:
            try:
                parent_sequence = self.nodes[parent_identifier.file].data
            except KeyError:
                diagnostics.append(
                    Diagnostic.error(
                        f'No such file "{parent_identifier.file}"',
                        parent_identifier.line))
                return obj
            try:
                _parent: _I = next(x for x in parent_sequence if x.ref == parent_identifier.ref)
                if _parent.ref is None:
                    _parent.ref = ''

                obj.ref = _parent.ref
                parent = _parent
            except StopIteration:
                diagnostics.append(Diagnostic.error(f'Failed to inherit {obj.ref}', obj.line))
                logger.debug('Inheritance failed: %s', obj.ref)
                return obj

        if obj.ref is None:
            obj.ref = ''

        obj = inherit(obj, parent)
        return obj

    def reify_file_id(self,
                      file_id: str,
                      diagnostics: Dict[PurePath, List[Diagnostic]]) -> GizaFile[_I]:
        node = self.nodes[file_id]
        return dataclasses.replace(node, data=[
            self.reify(el, diagnostics.setdefault(node.path, [])) for el in node.data])

    def reify_all_files(self,
                        diagnostics: Dict[PurePath, List[Diagnostic]]) -> Iterator[
                            Tuple[str, GizaFile[_I]]]:
        for file_id, node in self.nodes.items():
            data = [self.reify(el, diagnostics.setdefault(node.path, [])) for el in node.data]
            yield file_id, dataclasses.replace(node, data=data)

    def __len__(self) -> int:
        return len(self.nodes)

    def __delitem__(self, file_id: str) -> None:
        del self.dg[file_id]
        del self.nodes[file_id]


@checked
@dataclass
class OldHeading(Node):
    character: Optional[str]
    text: str


@dataclass
@checked
class HeadingMixin(Node):
    title: Union[str, OldHeading, None]
    heading: Union[str, OldHeading, None]
    level: Optional[int]
    optional: Optional[bool]

    def render_heading(self, parse_rst: EmbeddedRstParser) -> Sequence[SerializableType]:
        """Return a list of heading node representing this heading node's properties."""
        title = self.title if self.title is not None else self.heading
        if title is None:
            return ()

        heading_text = title.text if isinstance(title, OldHeading) else title

        if self.optional:
            heading_text = 'Optional: ' + heading_text

        result = parse_rst(heading_text, self.line, True)
        return ({
            'type': 'heading',
            'position': {'start': {'line': self.line}},
            'children': result
        },)
