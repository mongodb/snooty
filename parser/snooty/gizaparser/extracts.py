from dataclasses import dataclass
from typing import Dict, Optional
from .flutter import checked
from .nodes import Node, Inherit


@checked
@dataclass
class Extract(Node):
    ref: Optional[str]
    append: Optional[str]
    title: Optional[str]
    style: Optional[str]
    content: Optional[str]
    only: Optional[str]

    replacement: Optional[Dict[str, str]]
    inherit: Optional[Inherit]
