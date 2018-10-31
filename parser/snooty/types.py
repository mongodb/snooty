import hashlib
from dataclasses import dataclass
from typing import Any, Callable, Dict, Set, List, Tuple, Optional, Union

SerializableType = Union[None, bool, str, int, float, Dict[str, Any], List[Any]]


@dataclass
class StaticAsset:
    __slots__ = ('fileid', 'checksum', 'data')

    fileid: str
    checksum: str
    data: Optional[bytes]

    def __hash__(self) -> int:
        return hash(self.checksum)

    @classmethod
    def load(cls, fileid: str, path: str) -> 'StaticAsset':
        with open(path, 'rb') as f:
            data = f.read()
        asset_hash = hashlib.blake2b(data, digest_size=32).hexdigest()
        return StaticAsset(fileid, asset_hash, data)


@dataclass
class Page:
    __slots__ = ('path', 'source', 'ast', 'warnings', 'static_assets')

    path: str
    source: str
    ast: SerializableType
    warnings: List[Tuple[str, int]]

    static_assets: Set[StaticAsset]


EmbeddedRstParser = Callable[[str, int, bool], List[SerializableType]]
