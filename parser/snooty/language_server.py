import logging
import os
import sys
import threading
import jsonrpc.dispatchers
import jsonrpc.endpoint
import jsonrpc.streams
from dataclasses import dataclass
from functools import wraps
from pathlib import Path, PurePath
from typing import cast, Any, BinaryIO, Callable, Dict, List, Optional, Union, TypeVar
from .flutter import checked, check_type
from . import types
from .parser import Project, SerializableType

_F = TypeVar('_F', bound=Callable[..., Any])
Uri = str
PARENT_PROCESS_WATCH_INTERVAL_SECONDS = 60
logger = logging.getLogger(__name__)


class debounce:
    def __init__(self, wait: float) -> None:
        self.wait = wait

    def __call__(self, fn: _F) -> _F:
        wait = self.wait

        @wraps(fn)
        def debounced(*args: Any, **kwargs: Any) -> Any:
            def action() -> None:
                fn(*args, **kwargs)
            try:
                getattr(debounced, 'debounce_timer').cancel()
            except AttributeError:
                pass
            timer = threading.Timer(wait, action)
            setattr(debounced, 'debounce_timer', timer)
            timer.start()
        return cast(_F, debounced)


@checked
@dataclass
class Position:
    line: int
    character: int


@checked
@dataclass
class Range:
    start: Position
    end: Position


@checked
@dataclass
class Location:
    uri: Uri
    range: Range


@checked
@dataclass
class TextDocumentIdentifier:
    uri: Uri


@checked
@dataclass
class TextDocumentItem:
    uri: Uri
    languageId: str
    version: int
    text: str


@checked
@dataclass
class VersionedTextDocumentIdentifier(TextDocumentIdentifier):
    version: Union[int, None]


@checked
@dataclass
class TextDocumentContentChangeEvent:
    range: Optional[Range]
    rangeLength: Optional[int]
    text: str


@checked
@dataclass
class DiagnosticRelatedInformation:
    location: Location
    message: str


@checked
@dataclass
class Diagnostic:
    range: Range
    severity: Optional[int]
    code: Union[int, str, None]
    source: Optional[str]
    message: str
    relatedInformation: Optional[List[DiagnosticRelatedInformation]]


@checked
@dataclass
class Command:
    title: str
    command: str
    arguments: Optional[object]


@checked
@dataclass
class TextEdit:
    range: Range
    newText: str


@checked
@dataclass
class TextDocumentEdit:
    textDocument: VersionedTextDocumentIdentifier
    edits: List[TextEdit]


def pid_exists(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    else:
        return True


class Backend:
    def __init__(self, server: 'LanguageServer') -> None:
        self.server = server

    def on_progress(self, progress: int, total: int, message: str) -> None:
        pass

    def on_diagnostics(self, path: PurePath, diagnostics: List[types.Diagnostic]) -> None:
        self.server.set_diagnostics(path, diagnostics)

    def on_update(self, prefix: List[str], page_id: str, page: types.Page) -> None:
        pass

    def on_delete(self, page_id: str) -> None:
        pass


@dataclass
class WorkspaceEntry:
    page_id: str
    document_uri: Uri
    diagnostics: List[types.Diagnostic]

    def create_lsp_diagnostics(self) -> object:
        return [{
            'range': {
                'start': {
                    'line': diagnostic.start[0],
                    'character': diagnostic.start[1]
                },
                'end': {
                    'line': diagnostic.end[0],
                    'character': diagnostic.end[1]
                }
            },
            'severity': diagnostic.severity,
            'message': diagnostic.message
        } for diagnostic in self.diagnostics]


class LanguageServer(jsonrpc.dispatchers.MethodDispatcher):
    def __init__(self, rx: BinaryIO, tx: BinaryIO) -> None:
        self.project: Optional[Project] = None
        self.root_uri = ''
        self.workspace: Dict[str, WorkspaceEntry] = {}
        self.path_to_uri: Dict[PurePath, Uri] = {}
        self.diagnostics: Dict[PurePath, List[types.Diagnostic]] = {}

        self._jsonrpc_stream_reader = jsonrpc.streams.JsonRpcStreamReader(rx)
        self._jsonrpc_stream_writer = jsonrpc.streams.JsonRpcStreamWriter(tx)
        self._endpoint = jsonrpc.endpoint.Endpoint(self, self._jsonrpc_stream_writer.write)
        self._shutdown = False

    def start(self) -> None:
        self._jsonrpc_stream_reader.listen(self._endpoint.consume)

    def set_diagnostics(self, page_path: PurePath, diagnostics: List[types.Diagnostic]) -> None:
        if page_path not in self.path_to_uri:
            # Not open; don't report diagnostics
            return

        self.diagnostics[page_path] = diagnostics
        uri = self.path_to_uri[page_path]
        workspace_item = self.workspace[uri]
        workspace_item.diagnostics = diagnostics
        self._endpoint.notify('textDocument/publishDiagnostics', params={
            'uri': uri,
            'diagnostics': workspace_item.create_lsp_diagnostics()
        })

    def uri_to_path(self, uri: Uri) -> Path:
        path = Path(uri.replace('file://', '', 1).replace(self.root_uri, ''))
        self.path_to_uri[path] = uri
        return path

    def m_initialize(self, processId: Optional[int] = None, rootUri: Optional[Uri] = None,
                     **kwargs: object) -> SerializableType:
        if rootUri:
            root_path = Path(rootUri.replace('file://', '', 1))
            self.project = Project(root_path, Backend(self))
            self.project.build()
            self.rootUri = rootUri

        if processId is not None:
            def watch_parent_process(pid: int) -> None:
                # exist when the given pid is not alive
                if not pid_exists(pid):
                    logger.info('parent process %s is not alive', pid)
                    self.m_exit()
                logger.debug('parent process %s is still alive', pid)
                threading.Timer(
                    PARENT_PROCESS_WATCH_INTERVAL_SECONDS,
                    watch_parent_process,
                    args=[pid]).start()

            watching_thread = threading.Thread(target=watch_parent_process, args=(processId,))
            watching_thread.daemon = True
            watching_thread.start()

        return {'capabilities': {
            'textDocumentSync': 1,
        }}

    def m_initialized(self, **kwargs: object) -> None:
        # Ignore this message to avoid logging a pointless warning
        pass

    def m_text_document__did_open(self, textDocument: SerializableType) -> None:
        if not self.project:
            return

        item = check_type(TextDocumentItem, textDocument)
        page_path = self.uri_to_path(item.uri)
        page_id = self.project.get_page_id(page_path)
        entry = WorkspaceEntry(page_id, item.uri, [])
        self.workspace[item.uri] = entry
        self.project.update(page_path, item.text)

    @debounce(0.2)
    def m_text_document__did_change(self,
                                    textDocument: SerializableType,
                                    contentChanges: SerializableType) -> None:
        if not self.project:
            return

        identifier = check_type(VersionedTextDocumentIdentifier, textDocument)
        page_path = self.uri_to_path(identifier.uri)
        assert isinstance(contentChanges, list)
        change = next(check_type(TextDocumentContentChangeEvent, x) for x in contentChanges)
        self.project.update(page_path, change.text)

    def m_text_document__did_close(self, textDocument: SerializableType) -> None:
        if not self.project:
            return

        identifier = check_type(TextDocumentIdentifier, textDocument)
        page_path = self.uri_to_path(identifier.uri)
        del self.path_to_uri[page_path]
        del self.workspace[identifier.uri]
        self.project.update(page_path)

    def m_shutdown(self, **_kwargs: object) -> None:
        self._shutdown = True

    def m_exit(self, **_kwargs: object) -> None:
        self._endpoint.shutdown()
        self._jsonrpc_stream_reader.close()
        self._jsonrpc_stream_writer.close()
        sys.exit(0)


def start() -> None:
    stdin, stdout = sys.stdin.buffer, sys.stdout.buffer
    server = LanguageServer(stdin, stdout)
    server.start()
