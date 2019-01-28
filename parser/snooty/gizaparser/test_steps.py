from pathlib import Path, PurePath
from typing import Dict, Tuple, List
from .steps import GizaStepsCategory
from .nodes import ast_to_testing_string
from ..types import Diagnostic, Page, EmbeddedRstParser, ProjectConfig
from ..parser import make_embedded_rst_parser


def test_step() -> None:
    project_path, project_config, project_diagnostics = ProjectConfig.open(Path('test_data'))
    assert project_diagnostics == []

    category = GizaStepsCategory(project_config)
    path = Path('test_data/steps-test.yaml')
    child_path = Path('test_data/steps-test-child.yaml')

    def add_main_file() -> List[Diagnostic]:
        steps, text, parse_diagnostics = category.parse(path)
        category.add(path, text, steps)
        assert len(parse_diagnostics) == 0
        assert len(steps) == 4
        return parse_diagnostics

    def add_child_file() -> List[Diagnostic]:
        steps, text, parse_diagnostics = category.parse(child_path)
        category.add(child_path, text, steps)
        assert len(parse_diagnostics) == 0
        return parse_diagnostics

    all_diagnostics: Dict[PurePath, List[Diagnostic]] = {}
    all_diagnostics[path] = add_main_file()
    all_diagnostics[child_path] = add_child_file()

    file_id, giza_node = next(category.reify_all_files(all_diagnostics))

    def create_page() -> Tuple[Page, EmbeddedRstParser]:
        page = Page(path, '', {})
        return page, make_embedded_rst_parser(project_config, page, all_diagnostics[path])

    pages = category.to_pages(create_page, giza_node.data)
    assert len(pages) == 1
    print(repr(ast_to_testing_string(pages[0].ast)))
    assert ast_to_testing_string(pages[0].ast) == ''.join((
        '<directive name="steps"><directive name="step"><section><heading><text>Import the public ',
        'key used by the package management system.</text></heading><paragraph><text>Issue the ',
        'following command to import the\n</text><reference><text>MongoDB public GPG Key</text>',
        '</reference><target ids="[\'mongodb-public-gpg-key\']"></target></paragraph></section>',
        '</directive>',

        '<directive name="step"><section><heading><text>Create a </text><literal><text>',
        '/etc/apt/sources.list.d/mongodb-org-3.4.list</text></literal><text> file for MongoDB.',
        '</text></heading><paragraph><text>Create the list file using the command appropriate for ',
        'your version\nof Debian.</text></paragraph></section></directive>',

        '<directive name="step"><section><heading><text>Reload local package database.</text>',
        '</heading><paragraph><text>Issue the following command to reload the local package ',
        'database:</text></paragraph><code lang="sh" copyable="True">sudo apt-get update\n</code>',
        '</section></directive>',

        '<directive name="step"><section><heading><text>Install the MongoDB packages.</text>',
        '</heading><paragraph><text>You can install either the latest stable version of MongoDB ',
        'or a\nspecific version of MongoDB.</text></paragraph>',
        '<directive name="code-block">',
        '<text>sh</text><literal></literal></directive></section></directive></directive>'
    ))
