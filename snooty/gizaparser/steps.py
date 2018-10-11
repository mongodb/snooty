from dataclasses import dataclass
import docutils.parsers.rst.states
from typing import Any, Dict, Callable, Tuple, Optional, List, Union
from .flutter import checked
from .nodes import Node, Inherit, SerializableType

Warnings = List[Tuple[str, int]]
EmbeddedRstParser = Callable[[str, int, bool], Tuple[SerializableType, List[Tuple[str, int]]]]


@checked
@dataclass
class Action(Node):
    code: Optional[str]
    copyable: Optional[bool]
    content: Optional[str]
    heading: Optional[str]
    language: Optional[str]
    post: Optional[str]
    pre: Optional[str]

    def render(self, parse_rst: EmbeddedRstParser) -> Tuple[List[SerializableType], Warnings]:
        all_warnings: Warnings = []
        all_nodes: List[SerializableType] = []
        nodes_to_append_children: List[SerializableType] = all_nodes
        if self.heading:
            nodes_to_append_children = []
            all_nodes.append({
                'type': 'section',
                'position': {'start': {'line': self.__line__}},
                'children': nodes_to_append_children
            })

            result, warnings = parse_rst(self.heading, self.__line__, True)
            all_warnings.extend(warnings)

            nodes_to_append_children.append({
                'type': 'heading',
                'children': result
            })

        if self.pre:
            result, warnings = parse_rst(self.pre, self.__line__, False)
            nodes_to_append_children.append(result)
            all_warnings.extend(warnings)

        if self.code:
            nodes_to_append_children.append({
                'type': 'code',
                'lang': self.language,
                'copyable': False if self.copyable is None else self.copyable,
                'position': {'start': {'line': self.__line__}},
                'value': self.code
            })

        if self.content:
            result, warnings = parse_rst(self.content, self.__line__, False)
            nodes_to_append_children.append(result)
            all_warnings.extend(warnings)

        if self.post:
            result, warnings = parse_rst(self.post, self.__line__, False)
            nodes_to_append_children.append(result)
            all_warnings.extend(warnings)

        return all_nodes, all_warnings


@checked
@dataclass
class Step(Node):
    ref: Optional[str]
    title: Optional[str]
    stepnum: Optional[int]
    content: Optional[str]
    post: Optional[str]
    pre: Optional[str]
    level: Optional[int]

    action: Union[List[Action], Action, None]

    replacement: Optional[Dict[str, str]]
    inherit: Optional[Inherit]

    def render(self, parse_rst: EmbeddedRstParser) -> Tuple[SerializableType, Warnings]:
        all_warnings: Warnings = []
        children: List[SerializableType] = []
        root = {
            'type': 'section',
            'position': {'start': {'line': self.__line__}},
            'children': children
        }

        if self.title:
            children.append({
                'type': 'heading',
                'position': {'start': {'line': self.__line__}},
                'children': parse_rst(self.title, self.__line__, True)
            })

        if self.pre:
            result, warnings = parse_rst(self.pre, self.__line__, False)
            children.append(result)
            all_warnings.extend(warnings)

        if self.action:
            actions = [self.action] if isinstance(self.action, Action) else self.action
            for action in actions:
                result, warnings = action.render(parse_rst)
                children.extend(result)
                all_warnings.extend(warnings)

        if self.content:
            result, warnings = parse_rst(self.content, self.__line__, False)
            children.append(result)
            all_warnings.extend(warnings)

        if self.post:
            result, warnings = parse_rst(self.post, self.__line__, False)
            children.append(result)
            all_warnings.extend(warnings)

        return root, all_warnings
