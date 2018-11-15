import collections.abc
import typing
from typing import cast, Any, Dict, Type, TypeVar, Optional, Union
from typing_extensions import Protocol

CACHED_TYPES: Dict[type, Optional[Dict[str, type]]] = {}


class HasAnnotations(Protocol):
    __annotations__: Dict[str, type]


class Constructable(Protocol):
    def __init__(self, **kwargs: object) -> None: ...


T = TypeVar('T', bound=HasAnnotations)
C = TypeVar('C', bound=Constructable)


def checked(klass: Type[T]) -> Type[T]:
    """Marks a dataclass as being deserializable."""
    CACHED_TYPES[klass] = None
    return klass


class LoadError(TypeError):
    def __init__(self, message: str, ty: type, bad_data: object) -> None:
        super().__init__(message)
        self.expected_type = ty
        self.bad_data = bad_data


class LoadWrongType(LoadError):
    def __init__(self, ty: type, bad_data: object) -> None:
        super().__init__(
            'Incorrect type. Expected "{}", got "{}"'.format(ty, bad_data),
            ty,
            bad_data)


class LoadWrongArity(LoadWrongType):
    pass


class LoadUnknownField(LoadError):
    def __init__(self, ty: type, bad_data: object, bad_field: str) -> None:
        super().__init__('Unknown field "{}"'.format(bad_field), ty, bad_data)
        self.bad_field = bad_field


def check_type(ty: Type[C], data: object, ty_module: str = '') -> C:
    # Check for a primitive type
    if ty in (str, int, float, bool, type(None)):
        if not isinstance(data, ty):
            raise LoadWrongType(ty, data)
        return data

    # Check for an object
    if isinstance(data, dict) and ty in CACHED_TYPES:
        annotations = CACHED_TYPES[ty]
        if annotations is None:
            annotations = typing.get_type_hints(ty)
            CACHED_TYPES[ty] = annotations
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
            result[key] = check_type(expected_type, value, ty.__module__)

        return ty(**result)

    # Check for one of the special types defined by PEP-484
    origin = getattr(ty, '__origin__', None)
    if origin is not None:
        args = getattr(ty, '__args__')
        if origin is list:
            if not isinstance(data, list):
                raise LoadWrongType(ty, data)
            return cast(C, [check_type(args[0], x, ty_module) for x in data])
        elif origin is dict:
            if not isinstance(data, dict):
                raise LoadWrongType(ty, data)
            key_type, value_type = args
            return cast(C, {
                check_type(key_type, k, ty_module): check_type(value_type, v, ty_module)
                for k, v in data.items()})
        elif origin is tuple and isinstance(data, collections.abc.Collection):
            if not len(data) == len(args):
                raise LoadWrongArity(ty, data)
            return cast(C, tuple(
                check_type(tuple_ty, x, ty_module) for x, tuple_ty in zip(data, args)))
        elif origin is Union:
            for candidate_ty in args:
                try:
                    return cast(C, check_type(candidate_ty, data, ty_module))
                except LoadError:
                    pass

            raise LoadWrongType(ty, data)

        raise LoadError('Unsupported PEP-484 type', ty, data)

    if ty is object or ty is Any:
        return cast(C, data)

    raise LoadError('Unloadable type', ty, data)
