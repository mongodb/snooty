from pathlib import Path
from . import rstparser
from .util import ast_to_testing_string
from .types import ProjectConfig
from .parser import parse_rst, JSONVisitor


def test_tabs() -> None:
    root = Path('test_data')
    tabs_path = Path(root).joinpath(Path('test_tabs.rst'))
    project_config = ProjectConfig(root, '')
    parser = rstparser.Parser(project_config, JSONVisitor)
    page, diagnostics = parse_rst(parser, tabs_path, None)

    assert ast_to_testing_string(page.ast) == ''.join((
        '<root>',

        '<directive name="tabs"><directive name="tab"><text>bionic</text>',
        '<paragraph><text>Bionic content</text></paragraph></directive>',

        '<directive name="tab"><text>xenial</text><paragraph><text>',
        'Xenial content</text></paragraph></directive>',

        '<directive name="tab"><text>trusty</text><paragraph><text>',
        'Trusty content</text></paragraph></directive></directive>',

        '<directive name="tabs"><directive name="tab"><text>trusty</text><paragraph><text>',
        'Trusty content</text></paragraph></directive>',

        '<directive name="tab"><text>xenial</text><paragraph><text>',
        'Xenial content</text></paragraph></directive></directive>',

        '</root>'
    ))

    assert len(diagnostics) == 1 and \
        diagnostics[0].message.startswith('Unexpected field') and \
        diagnostics[0].start[0] == 36
