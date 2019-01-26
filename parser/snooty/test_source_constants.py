from pathlib import Path
from .types import ProjectConfig


def test_project() -> None:
    root_path, project_config, project_diagnostics = ProjectConfig.open(Path('test_data'))
    assert len(project_diagnostics) == 1
    assert project_config.constants == {
        'version': '3.4',
        'package_title': '3.4.tar.gz',
        'invalid': ''
    }
