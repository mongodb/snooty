from dataclasses import dataclass
from pathlib import PurePath
from typing import Optional, List, Sequence, Union, Tuple
from ..flutter import checked
from .parse import parse
from .nodes import Node, Inheritable, GizaCategory, GizaRegistry
from ..types import Diagnostic, EmbeddedRstParser, SerializableType, Page


@checked
@dataclass
class OldHeading(Node):
    character: Optional[str]
    text: str


@checked
@dataclass
class Action(Node):
    """An action that a user must take."""
    code: Optional[str]
    copyable: Optional[bool]
    content: Optional[str]
    heading: Union[str, OldHeading, None]
    language: Optional[str]
    post: Optional[str]
    pre: Optional[str]

    def render(self, parse_rst: EmbeddedRstParser) -> List[SerializableType]:
        all_nodes: List[SerializableType] = []
        nodes_to_append_children: List[SerializableType] = all_nodes
        if self.heading:
            nodes_to_append_children = []
            all_nodes.append({
                'type': 'section',
                'position': {'start': {'line': self.line}},
                'children': nodes_to_append_children
            })

            if isinstance(self.heading, OldHeading):
                heading_text = self.heading.text
            else:
                heading_text = self.heading

            result = parse_rst(heading_text, self.line, True)

            nodes_to_append_children.append({
                'type': 'heading',
                'children': result
            })

        if self.pre:
            result = parse_rst(self.pre, self.line, False)
            nodes_to_append_children.extend(result)

        if self.code:
            nodes_to_append_children.append({
                'type': 'code',
                'lang': self.language,
                'copyable': False if self.copyable is None else self.copyable,
                'position': {'start': {'line': self.line}},
                'value': self.code
            })

        if self.content:
            result = parse_rst(self.content, self.line, False)
            nodes_to_append_children.extend(result)

        if self.post:
            result = parse_rst(self.post, self.line, False)
            nodes_to_append_children.extend(result)

        return all_nodes


@checked
@dataclass
class Step(Inheritable):
    title: Union[str, None, OldHeading]
    stepnum: Optional[int]
    content: Optional[str]
    post: Optional[str]
    pre: Optional[str]
    level: Optional[int]
    optional: Optional[bool]

    action: Union[List[Action], Action, None]

    def render(self, page: Page, parse_rst: EmbeddedRstParser) -> SerializableType:
        children: List[SerializableType] = []
        root = {
            'type': 'section',
            'position': {'start': {'line': self.line}},
            'children': children
        }

        if self.title:
            if isinstance(self.title, OldHeading):
                heading_text = self.title.text
            else:
                heading_text = self.title

            result = parse_rst(heading_text, self.line, True)
            children.append({
                'type': 'heading',
                'position': {'start': {'line': self.line}},
                'children': result
            })

        if self.pre:
            result = parse_rst(self.pre, self.line, False)
            children.append(result)

        if self.action:
            actions = [self.action] if isinstance(self.action, Action) else self.action
            for action in actions:
                result = action.render(parse_rst)
                children.extend(result)

        if self.content:
            result = parse_rst(self.content, self.line, False)
            children.append(result)

        if self.post:
            result = parse_rst(self.post, self.line, False)
            children.append(result)

        return root


def step_to_page(page: Page, step: Step, rst_parser: EmbeddedRstParser) -> SerializableType:
    rendered = step.render(page, rst_parser)
    return {
        'type': 'directive',
        'name': 'step',
        'position': {'start': {'line': step.line}},
        'children': [rendered]
    }


@dataclass
class GizaStepsCategory(GizaCategory):
    registry: GizaRegistry[Step]

    def parse(self,
              path: PurePath,
              text: Optional[str] = None) -> Tuple[Sequence[Step], str, List[Diagnostic]]:
        return parse(Step, path, text)

    def to_page(self, page: Page, steps: Sequence[Step], rst_parser: EmbeddedRstParser) -> None:
        page.ast = {
            'type': 'directive',
            'name': 'steps',
            'position': {'start': {'line': 0}},
            'children': [step_to_page(page, step, rst_parser) for step in steps]
        }
