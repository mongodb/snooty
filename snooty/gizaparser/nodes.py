from dataclasses import dataclass
from .flutter import checked
from typing import Any, Dict, List, Union

SerializableType = Union[None, bool, str, int, float, Dict[str, Any], List[Any]]


@checked
@dataclass
class Node:
    __line__: int


@checked
@dataclass
class Inherit(Node):
    file: str
    ref: str
