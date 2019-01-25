from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional, List, Sequence, Union, Tuple
from ..flutter import checked
from .parse import parse
from .nodes import Inheritable, GizaCategory, HeadingMixin
from ..types import Diagnostic, EmbeddedRstParser, SerializableType, Page


@checked
@dataclass
class Action(HeadingMixin):
    """An action that a user must take."""
    code: Optional[str]
    copyable: Optional[bool]
    content: Optional[str]
    language: Optional[str]
    post: Optional[str]
    pre: Optional[str]

    def render(self, parse_rst: EmbeddedRstParser) -> List[SerializableType]:
        all_nodes: List[SerializableType] = []
        nodes_to_append_children: List[SerializableType] = all_nodes
        heading_nodes = self.render_heading(parse_rst)

        if heading_nodes:
            nodes_to_append_children = []
            all_nodes.append({
                'type': 'section',
                'position': {'start': {'line': self.line}},
                'children': nodes_to_append_children
            })

            nodes_to_append_children.extend(heading_nodes)

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
class Step(Inheritable, HeadingMixin):
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

        children.extend(self.render_heading(parse_rst))

        if self.pre:
            result = parse_rst(self.pre, self.line, False)
            children.extend(result)

        if self.action:
            actions = [self.action] if isinstance(self.action, Action) else self.action
            for action in actions:
                result = action.render(parse_rst)
                children.extend(result)

        if self.content:
            result = parse_rst(self.content, self.line, False)
            children.extend(result)

        if self.post:
            result = parse_rst(self.post, self.line, False)
            children.extend(result)

        return root


def step_to_page(page: Page, step: Step, rst_parser: EmbeddedRstParser) -> SerializableType:
    rendered = step.render(page, rst_parser)
    return {
        'type': 'directive',
        'name': 'step',
        'position': {'start': {'line': step.line}},
        'children': [rendered]
    }


class GizaStepsCategory(GizaCategory[Step]):
    def parse(self,
              path: Path,
              text: Optional[str] = None) -> Tuple[Sequence[Step], str, List[Diagnostic]]:
        return parse(Step, path, self.project_config, text)

    def to_pages(self,
                 page_factory: Callable[[], Tuple[Page, EmbeddedRstParser]],
                 steps: Sequence[Step]) -> List[Page]:
        page, rst_parser = page_factory()
        page.category = 'steps'
        page.ast = {
            'type': 'directive',
            'name': 'steps',
            'position': {'start': {'line': 0}},
            'children': [step_to_page(page, step, rst_parser) for step in steps]
        }
        return [page]
