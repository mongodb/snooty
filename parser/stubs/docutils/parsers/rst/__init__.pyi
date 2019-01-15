import docutils.nodes
import docutils.parsers.rst.states
import docutils.statemachine
from typing import Any, Dict, List


class Directive:
    arguments: List[str]
    block_text: str
    options: Any
    name: str
    content: docutils.statemachine.StringList
    content_offset: int
    state: docutils.parsers.rst.states.RSTState
    lineno: int
    state_machine: Any
    option_spec: Dict[str, object]

    required_arguments: int
    optional_arguments: int
    final_argument_whitespace: bool

    def add_name(self, node: docutils.nodes.Node) -> None: ...


class Parser:
    inliner: Any
    def parse(self, data: str, document: docutils.nodes.document) -> None: ...
