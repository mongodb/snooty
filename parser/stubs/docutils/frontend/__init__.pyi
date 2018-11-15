from typing import Sequence
import optparse


class Values(optparse.Values):
    report_level: int
    halt_level: int


class OptionParser:
    def __init__(self, components: Sequence[type]) -> None: ...
    def get_default_values(self) -> Values: ...
