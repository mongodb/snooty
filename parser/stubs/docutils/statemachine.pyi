import docutils.nodes
from typing import List, Iterator, Optional


class ViewList:
    def __init__(self, initlist: object=None, source: Optional[str]=None, items: object=None,
                 parent: Optional['ViewList']=None, parent_offset: Optional[int]=None) -> None: ...

    def __iter__(self) -> Iterator[str]: ...


class StringList(ViewList): ...


class State:
    document: docutils.nodes.document


def string2lines(astring: str,
                 tab_width: int = 8,
                 convert_whitespace: bool = False) -> List[str]: ...
