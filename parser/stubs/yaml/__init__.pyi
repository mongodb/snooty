from .nodes import Node
from .composer import Composer
from .constructor import SafeConstructor
from typing import Callable, Dict


class Loader(Composer, SafeConstructor):
    line: int
    def __init__(self, text: str) -> None: ...
    def add_constructor(self, tag: object, constructor: Callable[['Loader', Node], dict]) -> None: ...


class SafeLoader(Loader): ...
