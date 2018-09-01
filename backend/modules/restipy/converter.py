from collections import OrderedDict
from functools import wraps

from flask import request


class Converter:
    CONVERTIBLE_LIST = {}

    @staticmethod
    def serialize(data, fields, envelope=None):
        """Takes raw data (in the form of a dict, list, object) and a dict of
        fields to output and filters the data based on those fields.

        :param data: the actual object(s) from which the fields are taken from
        :param fields: a dict of whose keys will make up the final serialized
                       response output
        :param envelope: optional key that will be used to envelop the serialized
                         response
        """

        def make(cls):
            if isinstance(cls, type):
                return cls()
            return cls

        if isinstance(data, (list, tuple)):
            items = []
            for d in data:
                items.append(Converter.serialize(d, fields))
            if envelope is not None:
                return OrderedDict([(envelope, items)])
            else:
                return items

        items = {}
        for k, v in fields.items():
            if v.ignore_on_format:
                continue
            if isinstance(v, dict):
                items[k] = Converter.serialize(data, v)
            else:
                value_type = make(v)
                value = value_type.extract(k, data)
                items[k] = value_type.format(value)
        if envelope is not None:
            return OrderedDict([(envelope, OrderedDict(items))])
        else:
            return OrderedDict(items)

    @staticmethod
    def deserialize(data, fields, target_class, envelope=None):
        """Takes raw data (in the form of a dict, list, object) and a dict of
        fields to output and filters the data based on those fields.

        :param data: the actual object(s) from which the fields are taken from
        :param fields: a dict of whose keys are the deserialized request input
        :param target_class: the target class to generate from the request
        :param envelope: optional key that will be used to unwrap the request
        """

        def make(cls):
            if isinstance(cls, type):
                return cls()
            return cls

        data_items = data
        if envelope is not None:
            data_items = data[envelope]

        if isinstance(data_items, (list, tuple)):
            items = []
            for d in data_items:
                items.append(Converter.deserialize(d, fields, target_class))
            return items

        items = {}
        for k, v in fields.items():
            if v.ignore_on_parse:
                continue
            key = k
            if hasattr(v, 'attribute') and v.attribute is not None:
                key = v.attribute
            if isinstance(v, dict):
                items[key] = Converter.deserialize(data_items, v, target_class)
            else:
                value_type = make(v)
                value = value_type.extract(k, data, parsing=True)
                items[key] = value_type.parse(value)
        return target_class(**items)

    @staticmethod
    def format_as(source_class):
        """
        To be used as decorator on a route/controller.
        The response will be serialized from source class.

        :param source_class: the source class to serialize from
        :return: the decorated class
        """

        def decorator(m):
            r_name = source_class.__qualname__

            @wraps(m)
            def wrapper(*args, **kwargs):
                result = m(*args, **kwargs)
                if r_name in Converter.CONVERTIBLE_LIST:
                    class_metadata = Converter.CONVERTIBLE_LIST[r_name]
                    return Converter.serialize(
                        result,
                        class_metadata['fields'],
                        class_metadata['envelope']
                    )
                else:
                    return result

            return wrapper

        return decorator

    @staticmethod
    def parse_as(target_class):
        """
        To be used as decorator on a route/controller.
        The request body will be deserialized into the target class.

        :param target_class: the target class to deserialize into
        :return: the decorated class
        """

        def decorator(m):
            r_name = target_class.__qualname__

            @wraps(m)
            def wrapper(*args, **kwargs):
                json_body = request.get_json(force=True)
                class_metadata = Converter.CONVERTIBLE_LIST[r_name]
                parsed_value = Converter.deserialize(
                    json_body,
                    class_metadata['fields'],
                    class_metadata['reference'],
                    class_metadata['envelope']
                )
                return m(*args, parsed_value, **kwargs)

            if r_name in Converter.CONVERTIBLE_LIST:
                return wrapper
            else:
                return m

        return decorator

    @staticmethod
    def convertible(fields, envelope=None):
        """
        To be used as decorator to define a convertible class.
        The class will be serializable and deserializable

        :param fields: the dict of fields to serialize/deserialize
        :param envelope: if specified the fields will be wrapped with this value
        :return: the decorated class
        """

        def decorator(c):
            r_name = c.__qualname__
            if r_name not in Converter.CONVERTIBLE_LIST:
                Converter.CONVERTIBLE_LIST[r_name] = {
                    'reference': c,
                    'fields': fields,
                    'envelope': envelope
                }
            return c

        return decorator

    @staticmethod
    def get_fields(class_reference):
        """
        Returns the list of fields for a given class reference.

        :param class_reference: the class reference
        :return: the list of fields
        """
        r_name = class_reference.__qualname__
        if r_name in Converter.CONVERTIBLE_LIST:
            return Converter.CONVERTIBLE_LIST[r_name]['fields']
        return None
