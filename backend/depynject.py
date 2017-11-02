import inspect

__INJECTABLE_LIST__ = {}


def injectable(scope='singleton', **options):
    """
    To be used as decorator to define an injectable class.
    Constructor arguments of the class will be automatically resolved.

    :param scope: the scope of the created class ('singleton', 'prototype' or any other provided handler)
    :return: the decorated class
    """
    def decorator(c):
        args = inspect.getargspec(c.__init__).args[1:]
        __INJECTABLE_LIST__[c.__qualname__] = {
            'reference': c,
            'arguments': args,
            'scope': scope,
            'options': options
        }
        return c

    return decorator


class Depynject:

    def __init__(self, providers=None):
        self.singleton_store = {}
        self.providers = providers

    def provide(self, class_ref, **options):
        """
        Provides an instance of the specified class reference.

        :param class_ref: the class reference
        :param options: the options
        :return:
        """
        classname = class_ref.__qualname__
        i_scope = None
        if 'scope' in options:
            i_scope = options['scope']
        if classname not in __INJECTABLE_LIST__:
            scope = options.pop('scope', 'singleton')
            injectable(scope, **options)(class_ref)
        if i_scope is None:
            i_scope = __INJECTABLE_LIST__[classname]['scope']
        i_args = __INJECTABLE_LIST__[classname]['arguments']
        if i_scope == 'prototype':
            return self.create_new_instance(class_ref, i_args)
        if i_scope == 'singleton':
            if classname not in self.singleton_store:
                self.singleton_store[classname] = self.create_new_instance(class_ref, i_args)
            return self.singleton_store[classname]
        if i_scope in self.providers:
            return self.providers[classname](class_ref, i_args)
        raise Exception('Cannot resolve injectable class with name=' + classname)

    def create_new_instance(self, class_ref, arguments):
        """
        Creates a new instance of a class.

        :param class_ref: the class reference (to call the constructor)
        :param arguments: the list of argument names of the constructor
        :return: the new instance
        """
        arg_instances = {}
        for arg in arguments:
            arg_class_name = self.to_camel_case(arg)
            if arg_class_name not in __INJECTABLE_LIST__:
                raise Exception('Cannot resolve injectable constructor argument with name ' + arg_class_name)
            arg_obj = __INJECTABLE_LIST__[arg_class_name]
            arg_instances[arg] = self.provide(arg_obj['reference'], **arg_obj['options'])
        print('Creating new instance of ' + str(class_ref.__qualname__))
        return class_ref(**arg_instances)

    def register_singleton(self, instance):
        """
        Registers an instance as a singleton.

        :param instance: the instance to register
        :return: None
        """
        class_ref = instance.__class__
        injectable()(class_ref)
        self.singleton_store[class_ref.__qualname__] = instance

    @staticmethod
    def to_camel_case(snake_str):
        """
        Converts a snake_case_string to a CamelCaseString.

        :param snake_str: the string to convert
        :return: the converted string
        """
        components = snake_str.split('_')
        return "".join(x.title() for x in components)
