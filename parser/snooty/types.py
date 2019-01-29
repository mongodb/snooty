import enum
import hashlib
import re
from pathlib import Path, PurePath
from dataclasses import dataclass, field
import toml
from .flutter import checked, check_type
from typing import Any, Callable, Dict, Set, List, Tuple, Optional, Union, Match

PAT_VARIABLE = re.compile(r'{\+([\w-]+)\+}')
SerializableType = Union[None, bool, str, int, float, Dict[str, Any], List[Any]]
EmbeddedRstParser = Callable[[str, int, bool], List[SerializableType]]


class SnootyError(Exception):
    pass


class ProjectConfigError(SnootyError):
    pass


@dataclass
class Diagnostic:
    __slots__ = ('message', 'severity', 'start', 'end')

    class Level(enum.IntEnum):
        info = 0
        error = 1
        warning = 2

        @classmethod
        def from_docutils(cls, docutils_level: int) -> 'Diagnostic.Level':
            level = docutils_level - 1
            level = min(level, cls.warning)
            level = max(level, cls.info)
            return cls(level)

    severity: Level
    message: str
    start: Tuple[int, int]
    end: Tuple[int, int]

    @property
    def severity_string(self) -> str:
        return self.severity.name.title()

    @classmethod
    def create(cls, severity: Level, message: str,
               start: Union[int, Tuple[int, int]],
               end: Union[None, int, Tuple[int, int]] = None) -> 'Diagnostic':
        if isinstance(start, int):
            start_line, start_column = start, 0
        else:
            start_line, start_column = start

        if end is None:
            end_line, end_column = start_line, 1000
        elif isinstance(end, int):
            end_line, end_column = end, 1000
        else:
            end_line, end_column = end

        return cls(severity, message, (start_line, start_column), (end_line, end_column))

    @classmethod
    def warning(cls, message: str,
                start: Union[int, Tuple[int, int]],
                end: Union[None, int, Tuple[int, int]] = None) -> 'Diagnostic':
        return cls.create(cls.Level.warning, message, start, end)

    @classmethod
    def error(cls, message: str,
              start: Union[int, Tuple[int, int]],
              end: Union[None, int, Tuple[int, int]] = None) -> 'Diagnostic':
        return cls.create(cls.Level.error, message, start, end)


@dataclass
class StaticAsset:
    __slots__ = ('fileid', 'checksum', 'data')

    fileid: str
    checksum: str
    data: Optional[bytes]

    def __hash__(self) -> int:
        return hash(self.checksum)

    def __eq__(self, other: object) -> bool:
        return isinstance(other, StaticAsset) and \
               self.checksum == other.checksum and \
               self.fileid == other.fileid

    @classmethod
    def load(cls, fileid: str, path: Path) -> 'StaticAsset':
        data = path.read_bytes()
        asset_hash = hashlib.blake2b(data, digest_size=32).hexdigest()
        return cls(fileid, asset_hash, data)


@dataclass
class Page:
    source_path: Path
    source: str
    ast: SerializableType
    static_assets: Set[StaticAsset] = field(default_factory=set)
    category: Optional[str] = None
    output_filename: Optional[str] = None

    def get_id(self) -> PurePath:
        if self.category:
            # Giza wrote out yaml file artifacts under a directory. e.g. steps-foo.yaml becomes
            # steps/foo.rst
            return self.source_path.parent.joinpath(
                PurePath(self.category),
                (self.output_filename if
                 self.output_filename else
                 self.source_path.name.replace(f'{self.category}-', '', 1)))
        return self.source_path


@checked
@dataclass
class ProjectConfig:
    root: Path
    name: str
    constants: Dict[str, object] = field(default_factory=dict)

    @classmethod
    def open(cls, root: Path) -> Tuple[Path, 'ProjectConfig', List[Diagnostic]]:
        path = root
        while path.parent != path:
            try:
                with path.joinpath('snooty.toml').open() as f:
                    data = toml.load(f)
                    data['root'] = root
                    result, diagnostics = check_type(ProjectConfig, data).render_constants()
                    return path, result, diagnostics
            except FileNotFoundError:
                pass
            path = path.parent

        return root, cls(root, 'untitled'), []

    def render_constants(self) -> Tuple['ProjectConfig', List[Diagnostic]]:
        if not self.constants:
            return self, []
        constants: Dict[str, object] = {}
        all_diagnostics: List[Diagnostic] = []
        for k, v in self.constants.items():
            result, diagnostics = ProjectConfig.substitute(constants, str(v))
            all_diagnostics.extend(diagnostics)
            constants[k] = result

        self.constants = constants
        return self, all_diagnostics

    def read(self, path: Path) -> Tuple[str, List[Diagnostic]]:
        text = path.open().read()
        return ProjectConfig.substitute(self.constants, text)

    @staticmethod
    def substitute(constants: Dict[str, object], source: str) -> Tuple[str, List[Diagnostic]]:
        """Substitute all placeholders within a string."""
        diagnostics: List[Diagnostic] = []

        def handle_match(match: Match[str]) -> str:
            """Replace a given placeholder match with a value from the Sphinx
               configuration. Log a warning if it's not defined."""
            variable_name = match.group(1)
            try:
                return str(constants[variable_name])
            except KeyError:
                lineno = source.count('\n', 0, match.start())
                diagnostics.append(
                    Diagnostic.error(
                        f'{variable_name} not defined as a source constant',
                        lineno))
            return ''

        return PAT_VARIABLE.sub(handle_match, source), diagnostics
