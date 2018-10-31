from dataclasses import dataclass
from typing import Dict, Optional, List, Union
from .flutter import checked
from .nodes import Node, Inherit
from ..types import EmbeddedRstParser, SerializableType, Page


@checked
@dataclass
class OldHeading(Node):
    character: Optional[str]
    text: str


@checked
@dataclass
class Action(Node):
    code: Optional[str]
    copyable: Optional[bool]
    content: Optional[str]
    heading: Union[str, None, OldHeading]
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
                'position': {'start': {'line': self.__line__}},
                'children': nodes_to_append_children
            })

            if isinstance(self.heading, OldHeading):
                heading_text = self.heading.text
            else:
                heading_text = self.heading

            result = parse_rst(heading_text, self.__line__, True)

            nodes_to_append_children.append({
                'type': 'heading',
                'children': result
            })

        if self.pre:
            result = parse_rst(self.pre, self.__line__, False)
            nodes_to_append_children.extend(result)

        if self.code:
            nodes_to_append_children.append({
                'type': 'code',
                'lang': self.language,
                'copyable': False if self.copyable is None else self.copyable,
                'position': {'start': {'line': self.__line__}},
                'value': self.code
            })

        if self.content:
            result = parse_rst(self.content, self.__line__, False)
            nodes_to_append_children.extend(result)

        if self.post:
            result = parse_rst(self.post, self.__line__, False)
            nodes_to_append_children.extend(result)

        return all_nodes


@checked
@dataclass
class Step(Node):
    ref: Optional[str]
    title: Union[str, None, OldHeading]
    stepnum: Optional[int]
    content: Optional[str]
    post: Optional[str]
    pre: Optional[str]
    level: Optional[int]
    optional: Optional[bool]

    action: Union[List[Action], Action, None]

    replacement: Optional[Dict[str, object]]
    source: Optional[Inherit]
    inherit: Optional[Inherit]

    def render(self, page: Page, parse_rst: EmbeddedRstParser) -> SerializableType:
        children: List[SerializableType] = []
        root = {
            'type': 'section',
            'position': {'start': {'line': self.__line__}},
            'children': children
        }

        if self.title:
            if isinstance(self.title, OldHeading):
                heading_text = self.title.text
            else:
                heading_text = self.title

            result = parse_rst(heading_text, self.__line__, True)
            children.append({
                'type': 'heading',
                'position': {'start': {'line': self.__line__}},
                'children': result
            })

        if self.pre:
            result = parse_rst(self.pre, self.__line__, False)
            children.append(result)

        if self.action:
            actions = [self.action] if isinstance(self.action, Action) else self.action
            for action in actions:
                result = action.render(parse_rst)
                children.extend(result)

        if self.content:
            result = parse_rst(self.content, self.__line__, False)
            children.append(result)

        if self.post:
            result = parse_rst(self.post, self.__line__, False)
            children.append(result)

        return root
