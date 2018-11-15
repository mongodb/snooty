import os
import docutils.nodes
from typing import Container, Tuple, Iterator


def reroot_path(filename: str, docpath: str, project_root: str) -> Tuple[str, str]:
    """Files within a project may refer to other files. Return a canonical path
       relative to the project root."""
    if filename.startswith('/'):
        rel_fn = filename[1:]
    else:
        rel_fn = os.path.normpath(os.path.join(os.path.dirname(docpath), filename))
    return rel_fn, os.path.abspath(os.path.join(project_root, rel_fn))


def get_files(root: str, extensions: Container[str]) -> Iterator[str]:
    """Recursively iterate over files underneath the given root, yielding
       only filenames with the given extensions."""
    for root, dirs, files in os.walk(root):
        for name in files:
            ext = os.path.splitext(name)[1]

            if ext not in extensions:
                continue

            yield os.path.join(root, name)


def get_line(node: docutils.nodes.Node) -> int:
    """Return the first line number we can find in node's ancestry."""
    while node.line is None:
        if node.parent is None:
            # This is probably a document node
            return 0
        node = node.parent

    return node.line - 1
