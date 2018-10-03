from dataclasses import dataclass
from .flutter import checked


@checked
@dataclass
class Node:
    __line__: int


@checked
@dataclass
class Inherit(Node):
    file: str
    ref: str
