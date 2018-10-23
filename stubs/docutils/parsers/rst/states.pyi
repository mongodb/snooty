import docutils.parsers.rst.states
import docutils.statemachine
from typing import Dict, List, Tuple, Pattern, Union


class RSTState(docutils.statemachine.State):
    memo: docutils.parsers.rst.states.Struct

    def nested_parse(self,
        block: docutils.statemachine.ViewList,
        input_offset: int,
        node: docutils.nodes.Node,
        match_titles: bool=False) -> None: ...
    def inline_text(self, text: str, lineno: int) -> Tuple[List[docutils.nodes.Node], List[docutils.nodes.Node]]: ...


class Struct:
    title_styles: List
    section_level: int


class Body:
    patterns: Dict[str, Pattern] = ...
