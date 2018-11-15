class Mark:
    line: int
    column: int


class YAMLError(Exception): ...


class MarkedYAMLError(YAMLError):
    problem: str
    problem_mark: Mark
