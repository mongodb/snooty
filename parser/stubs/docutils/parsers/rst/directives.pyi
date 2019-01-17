from typing import Any, List, Type, Tuple
import docutils.nodes


def directive(directive_name: str, language_module: object, document: docutils.nodes.document) -> Tuple[Type[Any], List[object]]: ...
