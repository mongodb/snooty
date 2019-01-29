from pathlib import Path, PurePath
from .types import Diagnostic, ProjectConfig, StaticAsset, Page


def test_project() -> None:
    path = Path('test_data/bad_project')
    root_path, project_config, project_diagnostics = ProjectConfig.open(path)
    assert len(project_diagnostics) == 1
    assert project_config.constants == {
        'version': '3.4',
        'package_title': '3.4.tar.gz',
        'invalid': ''
    }

    path = Path('test_data/empty_project')
    root_path, project_config, project_diagnostics = ProjectConfig.open(path)
    assert project_config.constants == {}

    # Test missing project behavior
    root_path, project_config, project_diagnostics = ProjectConfig.open(Path('.').resolve())
    assert project_config.name == 'untitled'
    assert len(project_diagnostics) == 0


def test_diagnostics() -> None:
    diag = Diagnostic.warning('foo', (0, 0), 10)
    assert diag.severity_string == 'Warning'
    assert diag.start == (0, 0)
    assert diag.end[0] == 10 and diag.end[1] > 100

    diag = Diagnostic.warning('foo', (0, 0), (10, 0))
    assert diag.end == (10, 0)


def test_static_asset() -> None:
    path = Path('test_data/compass-explain-plan-with-index-raw-json.png')
    asset = StaticAsset.load('foo', path)
    assert asset.checksum == 'e8d907020488a0b0ba070ae3eeb86aae2713a61cc5bb28346c023cb505cced3c'
    asset2 = StaticAsset.load('foo', path)
    asset3 = StaticAsset.load('bar', path)

    assert asset == asset2 != asset3

    # Make sure that assets are hashed correctly
    collection = set((asset, asset2))
    assert len(collection) == 1
    collection = set((asset, asset3))
    assert len(collection) == 2


def test_page() -> None:
    page = Page(Path('foo.rst'), '', {})
    assert page.get_id() == PurePath('foo.rst')

    page = Page(Path('steps-foo.yaml'), '', {})
    page.category = 'steps'
    assert page.get_id() == PurePath('steps/foo.yaml')
