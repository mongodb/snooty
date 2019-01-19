from dataclasses import dataclass
from . import nodes


@dataclass
class Child:
    foo: str


@dataclass
class Parent:
    foo2: str


@dataclass
class SubstitutionTest(Parent):
    foo: str
    child: Child


def test_dependency_graph() -> None:
    dg = nodes.DependencyGraph()
    dg.set_dependencies('foo', {'a', 'b', 'c'})
    assert dg.dependencies == {'foo': {'a', 'b', 'c'}}
    assert dg.dependents == {'a': {'foo'}, 'b': {'foo'}, 'c': {'foo'}}

    dg.set_dependencies('foo', {'b'})
    assert dg.dependencies == {'foo': {'b'}}
    assert {k: v for k, v in dg.dependents.items() if v} == {'b': {'foo'}}


def test_substitution() -> None:
    replacements = {
        'verb': 'test',
        'noun': 'substitution'
    }
    test_string = r'{{verb}}ing {{noun}}. {{verb}}.'
    substituted_string = 'testing substitution. test.'
    assert nodes.substitute_text(test_string, replacements) == substituted_string

    # Test complex substitution
    node = SubstitutionTest(
        foo=test_string,
        foo2=test_string,
        child=Child(test_string))
    substituted_node = nodes.substitute(node, replacements)
    assert substituted_node == SubstitutionTest(
        foo=substituted_string,
        foo2=substituted_string,
        child=Child(substituted_string))

    # Make sure that no substitution == ''
    del replacements['noun']
    assert nodes.substitute_text(test_string, replacements) == 'testing . test.'

    # Ensure the identity of the zero-substitutions case remains the same
    test_string = 'foo'
    assert nodes.substitute_text(test_string, {}) is test_string
