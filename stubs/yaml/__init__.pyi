from .nodes import Node
from .composer import Composer
from .constructor import SafeConstructor
from typing import Dict


class Loader(Composer, SafeConstructor):
    line: int
    def __init__(self, text: str) -> None: ...
