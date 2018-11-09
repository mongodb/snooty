import os.path
from . import util


def test_reroot_path() -> None:
    relative, absolute = util.reroot_path('/foo/bar/baz.rst', '/foo/dir/test.txt', 'foo')
    assert os.path.isabs(absolute)
    assert relative == 'foo/bar/baz.rst'
    assert util.reroot_path('../bar/baz.rst', 'foo/dir/test.txt', 'foo')[0] == 'foo/bar/baz.rst'
