from dataclasses import dataclass
from typing import Dict, Optional, List, Union
from .flutter import checked
from .nodes import Node, Inherit


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
