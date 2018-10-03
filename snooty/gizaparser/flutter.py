import collections.abc
from typing import Dict, Type, TypeVar, Union
from typing_extensions import Protocol, runtime

CACHED_TYPES: Dict[type, Dict[str, type]] = {}


class HasAnnotations(Protocol):
    def __init__(self, **kwargs: object) -> None: ...
    __annotations__: Dict[str, type]


@runtime
class HasOrigin(Protocol):
    __origin__: type


T = TypeVar('T', bound=HasAnnotations)


def checked(klass: Type[T]) -> Type[T]:
    """Marks a dataclass as being deserializable."""
    annotations = {}
    for base in klass.__bases__:
        if base is object:
            continue

        annotations.update(CACHED_TYPES[base])

    annotations.update(klass.__annotations__)
    CACHED_TYPES[klass] = annotations

    return klass


class LoadError(TypeError):
    def __init__(self, message: str, ty: type, bad_data: object) -> None:
        super().__init__(message)
        self.expected_type = ty
        self.bad_data = bad_data


class LoadWrongType(LoadError):
    def __init__(self, ty: type, bad_data: object) -> None:
        super().__init__('Incorrect type. Expected "{}", got "{}"'.format(
            ty, type(bad_data)), ty, bad_data)


class LoadUnknownField(LoadError):
    def __init__(self, ty: type, bad_data: object, bad_field: str) -> None:
        super().__init__('Unknown field "{}"'.format(bad_field), ty, bad_data)
        self.bad_field = bad_field


def check_type(ty: Type[T], data: object) -> T:
    # Check for a primitive type
    if ty in (str, int, float, bool, type(None)):
        if not isinstance(data, ty):
            raise LoadWrongType(ty, data)
        return data

    # Check for an object
    if isinstance(data, dict) and ty in CACHED_TYPES:
        annotations = CACHED_TYPES[ty]
        result: Dict[str, object] = {}

        # Assign missing fields None
        for key in annotations:
            if key not in data:
                data[key] = None

        # Check field types
        for key, value in data.items():
            if key not in annotations:
                raise LoadUnknownField(ty, data, key)

            expected_type = annotations[key]
            result[key] = check_type(expected_type, value)

        return ty(**result)

    # Check for one of the special types defined by PEP-484
    # These tests should(?) be redundant, but the former is needed for
    # runtime, and the latter satisfies mypy.
    if hasattr(ty, '__origin__') and isinstance(ty, HasOrigin):
        if ty.__origin__ is list:
            if not isinstance(data, list):
                raise LoadWrongType(ty, data)
            arg, = ty.__args__
            return [check_type(arg, x) for x in data]
        elif ty.__origin__ is dict:
            if not isinstance(data, dict):
                raise LoadWrongType(ty, data)
            key_type, value_type = ty.__args__
            return {check_type(key_type, k): check_type(value_type, v) for k, v in data.items()}
        elif ty.__origin__ is tuple and isinstance(data, collections.abc.Collection):
            if not len(data) == len(ty.__args__):
                raise LoadError('Incorrect tuple arity', ty, data)
            return tuple(check_type(x, tuple_ty) for x, tuple_ty in zip(data, ty.__args__))
        elif ty.__origin__ is Union:
            for candidate_ty in ty.__args__:
                try:
                    return check_type(candidate_ty, data)
                except LoadError:
                    pass

            print(data)
            raise LoadWrongType(ty, data)

        raise LoadError('Unsupported PEP-484 type', ty, data)

    raise LoadError('Unloadable type', ty, data)
