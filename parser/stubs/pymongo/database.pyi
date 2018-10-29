from .collection import Collection


class Database:
    def __getitem__(self, name: str) -> Collection: ...
