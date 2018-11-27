import docutils.nodes
import docutils.utils
from typing import Any, Optional, Sequence, Union
from typing_extensions import Protocol


class NodeVisitor(Protocol):
    def dispatch_visit(self, node: docutils.nodes.Node) -> None: ...
    def dispatch_departure(self, node: docutils.nodes.Node) -> None: ...


class Node:
    source: Optional[str]
    line: Optional[int]
    parent: Optional[Node]
    document: Optional[Node]
    children: Sequence[Node]

    def walkabout(self, visitor: NodeVisitor) -> None: ...
    def astext(self) -> str: ...

    def __getitem__(self, key: Union[int, str]) -> Any: ...
    def __setitem__(self, key: str, value: Any) -> None: ...


class Root: ...


class Body: ...


class Inline: ...


class General(Body): ...


class Element(Node):
    def __init__(self, rawsource: str='', *children: Node, **attribute: object) -> None: ...
    def __contains__(self, key: str) -> bool: ...
    def append(self, node: Node) -> None: ...


class TextElement(Element):
    def __init__(self, rawsource: str='', text: str='', *children: Node, **attribute: object) -> None: ...


class FixedTextElement(TextElement): ...


class Structural: ...


class document(Root, Structural, Element):
    reporter: docutils.utils.Reporter


class TreePruningException(Exception): ...


class SkipNode(TreePruningException): ...


class system_message(Element): ...
