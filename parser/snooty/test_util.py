from pathlib import Path, PurePath
from . import util


def test_reroot_path() -> None:
    relative, absolute = util.reroot_path(
        PurePath('/foo/bar/baz.rst'),
        PurePath('/foo/dir/test.txt'),
        Path('foo'))
    assert absolute.is_absolute()
    assert relative == PurePath('foo/bar/baz.rst')
    assert util.reroot_path(
        PurePath('../bar/baz.rst'),
        PurePath('foo/dir/test.txt'),
        Path('foo'))[0] == PurePath('foo/bar/baz.rst')
