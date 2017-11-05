import inspect

__INJECTABLE_LIST__ = {}
__INJECTING_LIST__ = {}


def injectable(name=None, scope='singleton', **options):
    """
    To be used as decorator to define an injectable class.
    Constructor arguments of the class will be automatically resolved.

    :param name: the name to bind the injectable to (that should be used to resolve it)
    :param scope: the scope of the created class ('singleton', 'prototype' or any other provided handler)
    :return: the decorated class
    """
    def decorator(c):
        args = inspect.getargspec(c.__init__).args[1:]
        injecting_methods = []
        r_name = c.__qualname__
        if name is not None:
            r_name = Depynject.to_camel_case(name)
        for n, method in c.__dict__.items():
            if hasattr(method, '__inject_decorated__'):
                injecting_methods.append(method.__inject_decorated__)
        __INJECTABLE_LIST__[r_name] = {
            'reference': c,
            'arguments': args,
            'scope': scope,
            'options': options,
            'injecting_methods': injecting_methods
        }
        return c

    return decorator


def inject(silent=False, **hints):
    """
    Makes the method's arguments injectable.
    When calling the method, not resolved arguments will be tried to be resolved.

    :param: silent: if False, an unresolved dependency will raise an InjectionError, otherwise nothing happens
    :param: hints: other arguments will be looked at for finding the injectable
    :return: the decorated method
    """
    def wrap(m):

        def wrapper(*args, **kwargs):
            instance = __INJECTING_LIST__[m.__qualname__]['bound_instance']
            if instance is not None:
                defaults = __INJECTING_LIST__[m.__qualname__]['defaults']
                if defaults is not None:
                    arguments = list(reversed(__INJECTING_LIST__[m.__qualname__]['arguments']))
                    num_args = len((list(args)[1:]))
                    args_to_resolve = list(defaults)[num_args:]
                    for idx, val in enumerate(reversed(args_to_resolve)):
                        # We loop through the default args that were not given as positional arg
                        if val is not None:
                            # The default value should be None
                            continue
                        arg_name = arguments[idx]
                        if arg_name in kwargs:
                            # The default arg should not be given as named arg
                            continue
                        resolve_name = arg_name
                        if arg_name in hints and isinstance(hints[arg_name], str):
                            # Is there a hint given as a string ?
                            resolve_name = hints[arg_name]
                        print('Injecting [' + arg_name + '=' + resolve_name + '] in method ' + m.__qualname__)
                        try:
                            kwargs[arg_name] = instance.provide(resolve_name)
                        except InjectionError as e:
                            if not silent:
                                raise e
            else:
                print('Invoked ' + m.__qualname__ + ' with @inject but no DI context bound (is the class injectable ?)')
            return m(*args, **kwargs)

        return wrapper

    def decorator(m):
        argspec = inspect.getargspec(m)
        __INJECTING_LIST__[m.__qualname__] = {
            'reference': m,
            'arguments': argspec.args[1:],
            'defaults': argspec.defaults,
            'bound_instance': None
        }
        w = wrap(m)
        w.__inject_decorated__ = m.__qualname__
        return w

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
        if isinstance(class_ref, str):
            return self.__provide_by_name__(class_ref)
        classname = class_ref.__qualname__
        i_scope = None
        if 'scope' in options:
            i_scope = options['scope']
        if classname not in __INJECTABLE_LIST__:
            scope = options.pop('scope', 'singleton')
            injectable(scope=scope, **options)(class_ref)
        for m in __INJECTABLE_LIST__[classname]['injecting_methods']:
            print(m)
            if __INJECTING_LIST__[m]['bound_instance'] is None:
                print('method is bound to instance !')
                __INJECTING_LIST__[m]['bound_instance'] = self
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
        raise InjectionError('Cannot resolve injectable class with name ' + classname)

    def __provide_by_name__(self, class_name):
        """
        Tries to provide an instance by name.

        :param class_name: the class name as string
        :return: the instance
        """
        arg_class_name = self.to_camel_case(class_name)
        if arg_class_name not in __INJECTABLE_LIST__:
            raise InjectionError('Cannot resolve injectable constructor argument with name ' + arg_class_name)
        arg_obj = __INJECTABLE_LIST__[arg_class_name]
        return self.provide(arg_obj['reference'], **arg_obj['options'])

    def create_new_instance(self, class_ref, arguments):
        """
        Creates a new instance of a class.

        :param class_ref: the class reference (to call the constructor)
        :param arguments: the list of argument names of the constructor
        :return: the new instance
        """
        arg_instances = {}
        for arg in arguments:
            arg_instances[arg] = self.__provide_by_name__(arg)
        print('Creating new instance of ' + str(class_ref.__qualname__))
        return class_ref(**arg_instances)

    def register_singleton(self, instance, name=None):
        """
        Registers an instance as a singleton.

        :param instance: the instance to register
        :param name: the name to bind the instance to
        :return: None
        """
        class_ref = instance.__class__
        injectable(name)(class_ref)
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


class InjectionError(Exception):
    def __init__(self, m):
        self.message = m

    def __str__(self):
        return self.message
