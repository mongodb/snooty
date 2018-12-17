class Node:
    tag: str
    value: object
    start_mark: object
    end_mark: object
    _start_line: int


class ScalarNode(Node):
    id: str
    style: object


class CollectionNode(Node):
    flow_style: object


class SequenceNode(CollectionNode):
    id: str


class MappingNode(CollectionNode):
    id: str
