from pathlib import Path
from .types import ProjectConfig


def test_project() -> None:
    path = Path('test_data/bad_project')
    root_path, project_config, project_diagnostics = ProjectConfig.open(path)
    assert len(project_diagnostics) == 1
    assert project_config.constants == {
        'version': '3.4',
        'package_title': '3.4.tar.gz',
        'invalid': ''
    }
