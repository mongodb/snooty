from pathlib import Path, PurePath
from typing import Dict, Tuple, List
from .extracts import GizaExtractsCategory
from .nodes import ast_to_testing_string
from ..types import Diagnostic, Page, EmbeddedRstParser
from ..parser import make_embedded_rst_parser


def test_extract() -> None:
    category = GizaExtractsCategory()
    path = Path('test_data/extracts-test.yaml')
    child_path = Path('test_data/extracts-test-child.yaml')

    def add_main_file() -> List[Diagnostic]:
        extracts, text, parse_diagnostics = category.parse(path)
        category.add(path, text, extracts)
        assert len(parse_diagnostics) == 1
        assert parse_diagnostics[0].severity == Diagnostic.Level.error
        assert parse_diagnostics[0].start == (21, 0)
        assert len(extracts) == 4
        return parse_diagnostics

    def add_child_file() -> List[Diagnostic]:
        extracts, text, parse_diagnostics = category.parse(child_path)
        category.add(child_path, text, extracts)
        assert len(parse_diagnostics) == 0
        assert len(extracts) == 1
        return parse_diagnostics

    all_diagnostics: Dict[PurePath, List[Diagnostic]] = {}
    all_diagnostics[path] = add_main_file()
    all_diagnostics[child_path] = add_child_file()

    file_id, giza_node = next(category.reify_all_files(all_diagnostics))

    def create_page() -> Tuple[Page, EmbeddedRstParser]:
        page = Page(path, '', {})
        return page, make_embedded_rst_parser(path, page, all_diagnostics[path])

    pages = category.to_pages(create_page, giza_node.data)
    assert len(pages) == 4
    assert ast_to_testing_string(pages[0].ast) == ''.join((
        '<directive name="extract"><paragraph><text>By default, MongoDB stores its data files in ',
        '{{mongodDatadir}} and its\nlog files in </text><literal><text>/var/log/mongodb</text>',
        '</literal><text>.</text></paragraph></directive>'
    ))

    assert ast_to_testing_string(pages[1].ast) == ''.join((
        '<directive name="extract"><paragraph><text>By default, MongoDB stores its data files in ',
        '</text><literal><text>/var/lib/mongo</text></literal><text> and its\nlog files in </text>',
        '<literal><text>/var/log/mongodb</text></literal><text>.</text></paragraph></directive>'
    ))

    # XXX: We need to track source file information for each property.
    # Line number 1 here should correspond to child_path, not path.
    assert set(d.start[0] for d in all_diagnostics[path]) == set((21, 13, 1))
