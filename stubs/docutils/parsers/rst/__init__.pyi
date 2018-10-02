import docutils.nodes
import docutils.statemachine
from typing import Any


class RSTState(docutils.statemachine.State):
    def nested_parse(self, block: str, input_offset: int, node: docutils.nodes.Node) -> None: ...


class Directive:
    name: str
    content: str
    content_offset: int
    state: RSTState
    lineno: int
    state_machine: Any

    def add_name(self, node: docutils.nodes.Node) -> None: ...


class Parser:
    def parse(self, data: str, document: docutils.nodes.document) -> None: ...
