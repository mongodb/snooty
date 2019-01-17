import enum
import hashlib
from dataclasses import dataclass
from pathlib import PurePath
from typing import Any, Callable, Dict, Set, List, Tuple, Optional, Union

SerializableType = Union[None, bool, str, int, float, Dict[str, Any], List[Any]]
EmbeddedRstParser = Callable[[str, int, bool], List[SerializableType]]


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

    @classmethod
    def load(cls, fileid: str, path: PurePath) -> 'StaticAsset':
        with open(path, 'rb') as f:
            data = f.read()
        asset_hash = hashlib.blake2b(data, digest_size=32).hexdigest()
        return cls(fileid, asset_hash, data)


@dataclass
class Page:
    source_path: PurePath
    source: str
    ast: SerializableType
    diagnostics: List[Diagnostic]
    static_assets: Set[StaticAsset]
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
