from dataclasses import dataclass
from pathlib import PurePath
from typing import Callable, List, Tuple, Sequence, Optional
from ..flutter import checked
from .nodes import Inheritable, GizaCategory, GizaRegistry, HeadingMixin
from .parse import parse
from ..types import Diagnostic, EmbeddedRstParser, SerializableType, Page


@checked
@dataclass
class Extract(Inheritable, HeadingMixin):
    content: Optional[str]
    only: Optional[str]

    def render(self, page: Page, parse_rst: EmbeddedRstParser) -> SerializableType:
        if self.only is not None:
            raise NotImplementedError('extracts: "only" not implemented')

        children: List[SerializableType] = []
        children.extend(self.render_heading(parse_rst))
        if self.content:
            children.extend(parse_rst(self.content, self.line, False))

        return children


def extract_to_page(page: Page,
                    extract: Extract,
                    rst_parser: EmbeddedRstParser) -> SerializableType:
    rendered = extract.render(page, rst_parser)
    return {
        'type': 'directive',
        'name': 'extract',
        'position': {'start': {'line': extract.line}},
        'children': rendered
    }


@dataclass
class GizaExtractsCategory(GizaCategory):
    registry: GizaRegistry[Extract]

    def parse(self,
              path: PurePath,
              text: Optional[str] = None) -> Tuple[Sequence[Extract], str, List[Diagnostic]]:
        extracts, text, diagnostics = parse(Extract, path, text)

        def report_missing_ref(extract: Extract) -> bool:
            diagnostics.append(
                Diagnostic.error('Missing ref; all extracts must define a ref', extract.line))
            return False

        # All extracts must have an explicitly-defined ref ID
        extracts = [extract for extract in extracts if extract.ref or report_missing_ref(extract)]
        return extracts, text, diagnostics

    def to_pages(self,
                 page_factory: Callable[[], Tuple[Page, EmbeddedRstParser]],
                 extracts: Sequence[Extract]) -> List[Page]:
        pages: List[Page] = []
        for extract in extracts:
            page, rst_parser = page_factory()
            page.category = 'extract'
            assert extract.ref is not None
            page.output_filename = extract.ref
            page.ast = extract_to_page(page, extract, rst_parser)
            pages.append(page)

        return pages
