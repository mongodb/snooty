import os
import docutils.nodes
from pathlib import Path, PurePath
from typing import Container, Tuple, Iterator


def reroot_path(filename: PurePath,
                docpath: PurePath,
                project_root: Path) -> Tuple[PurePath, PurePath]:
    """Files within a project may refer to other files. Return a canonical path
       relative to the project root."""
    if filename.is_absolute():
        rel_fn = PurePath(*filename.parts[1:])
    else:
        rel_fn = PurePath(os.path.normpath(docpath.parent.joinpath(filename)))
    return rel_fn, project_root.joinpath(rel_fn).resolve()


def get_files(root: PurePath, extensions: Container[str]) -> Iterator[PurePath]:
    """Recursively iterate over files underneath the given root, yielding
       only filenames with the given extensions."""
    for base, dirs, files in os.walk(root):
        for name in files:
            ext = os.path.splitext(name)[1]

            if ext not in extensions:
                continue

            yield PurePath(os.path.join(base, name))


def get_line(node: docutils.nodes.Node) -> int:
    """Return the first line number we can find in node's ancestry."""
    while node.line is None:
        if node.parent is None:
            # This is probably a document node
            return 0
        node = node.parent

    return node.line - 1
