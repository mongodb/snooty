import os
import docutils.nodes
from pathlib import Path, PurePath
from typing import cast, Any, Container, Optional, Tuple, Iterator


def reroot_path(filename: PurePath,
                docpath: PurePath,
                project_root: Path) -> Tuple[PurePath, Path]:
    """Files within a project may refer to other files. Return a canonical path
       relative to the project root."""
    if filename.is_absolute():
        rel_fn = PurePath(*filename.parts[1:])
    else:
        rel_fn = PurePath(os.path.normpath(docpath.parent.joinpath(filename)))
    return rel_fn, project_root.joinpath(rel_fn).resolve()


def get_files(root: PurePath, extensions: Container[str]) -> Iterator[Path]:
    """Recursively iterate over files underneath the given root, yielding
       only filenames with the given extensions."""
    for base, dirs, files in os.walk(root):
        for name in files:
            ext = os.path.splitext(name)[1]

            if ext not in extensions:
                continue

            yield Path(os.path.join(base, name))


def get_line(node: docutils.nodes.Node) -> int:
    """Return the first line number we can find in node's ancestry."""
    def line_of_node(node: docutils.nodes.Node) -> Optional[int]:
        """Sometimes you need node['line']. Sometimes you need node.line.
           Sometimes you want to just run away and herd yaks."""
        if isinstance(node, docutils.nodes.Element) and 'line' in node:
            return cast(int, node['line'])

        return node.line

    while line_of_node(node) is None:
        if node.parent is None:
            # This is probably a document node
            return 0
        node = node.parent

    return cast(int, line_of_node(node)) - 1


def ast_to_testing_string(ast: Any) -> str:
    value = ast.get('value', '')
    children = ast.get('children', [])
    attrs = ' '.join(
        '{}="{}"'.format(k, v) for k, v in ast.items() if k not in (
            'argument', 'value', 'children', 'type', 'position') and v)
    contents = value if value else (''.join(
        ast_to_testing_string(child) for child in children)
        if children else '')
    if 'argument' in ast:
        contents = ''.join(ast_to_testing_string(part) for part in ast['argument']) + contents
    return '<{}{}>{}</{}>'.format(
        ast['type'],
        ' ' + attrs if attrs else '',
        contents,
        ast['type'])
