from typing import List, Type, Tuple
import docutils.nodes


def directive(directive_name: str, language_module: object, document: docutils.nodes.document) -> Tuple[Type, List]: ...
