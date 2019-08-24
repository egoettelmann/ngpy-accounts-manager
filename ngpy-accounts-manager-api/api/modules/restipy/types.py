from datetime import datetime
from decimal import Decimal, ROUND_HALF_EVEN

from .converter import Converter


class SerializationException(Exception):
    """
    This is an encapsulating Exception in case of serialization error.
    """

    def __init__(self, underlying_exception):
        # just put the contextual representation of the error to hint on what
        # went wrong without exposing internals
        super(SerializationException, self).__init__(underlying_exception)


def is_indexable_but_not_string(obj):
    return not hasattr(obj, "strip") and hasattr(obj, "__iter__")


def get_value(key, obj, default=None):
    """Helper for pulling a keyed value off various types of objects"""
    if isinstance(key, int):
        return _get_value_for_key(key, obj, default)
    elif callable(key):
        return key(obj)
    else:
        return _get_value_for_keys(key.split('.'), obj, default)


def _get_value_for_keys(keys, obj, default):
    if len(keys) == 1:
        return _get_value_for_key(keys[0], obj, default)
    else:
        return _get_value_for_keys(
            keys[1:], _get_value_for_key(keys[0], obj, default), default)


def _get_value_for_key(key, obj, default):
    if is_indexable_but_not_string(obj):
        try:
            return obj[key]
        except (IndexError, TypeError, KeyError):
            pass
    return getattr(obj, key, default)


def to_serializable_type(obj):
    """Helper for converting an object to a dictionary only if it is not
    dictionary already or an indexable object nor a simple type"""
    if obj is None:
        return None  # make it idempotent for None

    if hasattr(obj, '__marshallable__'):
        return obj.__marshallable__()

    if hasattr(obj, '__getitem__'):
        return obj  # it is indexable it is ok

    return dict(obj.__dict__)


class Raw(object):
    """Raw provides a base field class from which others should extend. It
    applies no formatting by default, and should only be used in cases where
    data does not need to be formatted before being serialized. Fields should
    throw a :class:`SerializationException` in case of parsing problem.

    :param default: The default value for the field, if no value is
        specified.
    :param attribute: If the public facing value differs from the internal
        value, use this to retrieve a different attribute from the response
        than the publicly named value.
    :param ignore_on_parse: If the ignore_on_parse flag is set to True,
        the value will be ignored while parsing
    :param ignore_on_format: If the ignore_on_format flag is set to True,
        the value will be ignored while formatting
    """

    def __init__(self, default=None, attribute=None, ignore_on_parse=False, ignore_on_format=False):
        self.attribute = attribute
        self.default = default
        self.ignore_on_parse = ignore_on_parse
        self.ignore_on_format = ignore_on_format

    def format(self, value):
        """Formats a field's value. No-op by default - type classes that
        modify how the value of existing object keys should be presented should
        override this and apply the appropriate formatting.

        :param value: The value to format
        :exception SerializationException: In case of formatting problem

        Ex::

            class TitleCase(Raw):
                def format(self, value):
                    return unicode(value).title()
        """
        return value

    def parse(self, value):
        """Parses a given value as the type. No-op by default - type classes that
        modify how the value of existing object keys should be parsed should
        override this and perform the appropriate parsing.

        :param value: the value to parse
        :exception SerializationException: In case of formatting problem
        :return: the parsed value
        """
        return value

    def extract(self, key, obj, parsing=False):
        """Pulls the value for the given key from the object
        If the key is not found in the object, returns the default value.
        Type classes that create values which do not require the existence
        of the key in the object should override this and return the desired value.

        :param key: the key to extract
        :param obj: the object to extract the value from
        :param parsing: by default the value for formatting is retrieved,
            when the parse flag is set to True, the value for parsing
            will be retrieved
        :exception SerializationException: In case of formatting problem
        """

        if parsing:
            value = get_value(key, obj)
        else:
            value = get_value(key if self.attribute is None else self.attribute, obj)

        if value is None:
            return self.default

        return value


class Nested(Raw):
    """Allows you to nest one set of fields inside another.
    See :ref:`nested-field` for more information

    :param class nested: The dictionary to nest
    :param bool allow_null: Whether to return None instead of a dictionary
        with null keys, if a nested dictionary has all-null keys
    :param kwargs: If ``default`` keyword argument is present, a nested
        dictionary will be marshaled as its value if nested dictionary is
        all-null keys (e.g. lets you return an empty JSON object instead of
        null)
    """

    def __init__(self, nested, allow_null=False, **kwargs):
        self.nested = nested
        self.allow_null = allow_null
        super(Nested, self).__init__(**kwargs)

    def format(self, value):
        fields = Converter.get_fields(self.nested)
        return Converter.serialize(value, fields)

    def parse(self, value):
        fields = Converter.get_fields(self.nested)
        return Converter.deserialize(value, fields, self.nested)

    def extract(self, key, obj, parsing=False):
        if parsing:
            value = get_value(key, obj)
        else:
            value = get_value(key if self.attribute is None else self.attribute, obj)

        if value is None:
            if self.allow_null:
                return None
            elif self.default is not None:
                return self.default

        return value


class String(Raw):
    """
    Marshal a value as a string. Uses ``six.text_type`` so values will
    be converted to :class:`unicode` in python2 and :class:`str` in
    python3.
    """

    def __init__(self, **kwargs):
        super(String, self).__init__(**kwargs)

    def format(self, value):
        try:
            return str(value)
        except ValueError as ve:
            raise SerializationException(ve)

    def parse(self, value):
        try:
            return str(value)
        except ValueError as ve:
            raise SerializationException(ve)


class Integer(Raw):
    """ Field for outputting an integer value.

    :param int default: The default value for the field, if no value is
        specified.
    """

    def __init__(self, default=None, **kwargs):
        super(Integer, self).__init__(default=default, **kwargs)

    def format(self, value):
        try:
            if value is None:
                return self.default
            return int(value)
        except ValueError as ve:
            raise SerializationException(ve)

    def parse(self, value):
        try:
            if value is None:
                return self.default
            return int(value)
        except ValueError as ve:
            raise SerializationException(ve)


class Boolean(Raw):
    """
    Field for outputting a boolean value.

    Empty collections such as ``""``, ``{}``, ``[]``, etc. will be converted to
    ``False``.
    """

    def __init__(self, **kwargs):
        super(Boolean, self).__init__(**kwargs)

    def format(self, value):
        return bool(value)

    def parse(self, value):
        return bool(value)


class Float(Raw):
    """
    A double as IEEE-754 double precision.
    ex : 3.141592653589793 3.1415926535897933e-06 3.141592653589793e+24 nan inf
    -inf
    """

    def __init__(self, **kwargs):
        super(Float, self).__init__(**kwargs)

    def format(self, value):
        try:
            if value is None:
                return self.default
            return float(value)
        except ValueError as ve:
            raise SerializationException(ve)

    def parse(self, value):
        try:
            if value is None:
                return self.default
            return float(value)
        except ValueError as ve:
            raise SerializationException(ve)


class DateTime(Raw):
    """
    Return a formatted datetime string in UTC. Supported formats are RFC 822
    and ISO 8601.

    See :func:`email.utils.formatdate` for more info on the RFC 822 format.

    See :meth:`datetime.datetime.isoformat` for more info on the ISO 8601
    format.

    :param dt_format: ``'rfc822'`` or ``'iso8601'``
    :type dt_format: str
    """

    def __init__(self, dt_format='iso8601', **kwargs):
        super(DateTime, self).__init__(**kwargs)
        self.dt_format = dt_format

    def format(self, value):
        try:
            if value is None:
                return self.default
            if self.dt_format == 'iso8601':
                return value.isoformat()
            else:
                value.strftime(self.dt_format)
        except AttributeError as ae:
            raise SerializationException(ae)

    def parse(self, value):
        try:
            if self.dt_format == 'iso8601':
                return datetime.strptime(value, '%Y-%m-%d')
            else:
                return datetime.strptime(value, self.dt_format)
        except AttributeError as ae:
            raise SerializationException(ae)


class Fixed(Raw):
    """
    A decimal number with a fixed precision.
    """

    def __init__(self, decimals=5, **kwargs):
        super(Fixed, self).__init__(**kwargs)
        self.precision = Decimal('0.' + '0' * (decimals - 1) + '1')

    def format(self, value):
        d_value = Decimal(value)
        if not d_value.is_normal() and d_value != Decimal():
            raise SerializationException('Invalid Fixed precision number.')
        return str(d_value.quantize(self.precision, rounding=ROUND_HALF_EVEN))

    def parse(self, value):
        d_value = Decimal(value)
        return d_value
