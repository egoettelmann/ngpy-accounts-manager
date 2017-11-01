from flask.json import jsonify

__PREFIX_LIST__ = {}
__ROUTES_LIST__ = {}


def prefix(rule, **options):
    """
    To be used as decorator to define a prefix for a controller class.
    This decorator should be present on any class defining restful routes.

    :param rule: the url rule
    :param options: the options
    :return: the decorated class
    """
    def decorator(c):
        __PREFIX_LIST__[c.__qualname__] = {
            'instance': c(), # TODO: This should be handled through a DI mechanism
            'rule': rule,
            'options': options
        }
        return c

    return decorator


def route(rule, **options):
    """
    To be used as decorator to define a method as a route.

    :param rule: the url rule
    :param options: any options you can pass to flasks 'add_url_rule' (or @app.route decorator)
    :return: the decorated method
    """
    def decorator(f):
        classpath = f.__qualname__.split('.')
        if len(classpath) > 1:
            classname = classpath[0]
            if classname not in __ROUTES_LIST__:
                __ROUTES_LIST__[classname] = []
            __ROUTES_LIST__[classname].append({
                'function': f,
                'rule': rule,
                'options': options
            })
        return f

    return decorator


class Api:

    def __init__(self, app, prefix="", jsonifier=jsonify):
        self.app = app
        self.prefix = prefix
        self.jsonifier = jsonifier

    def register(self, class_ref, options=None):
        classname = class_ref.__qualname__
        if classname in __ROUTES_LIST__:
            full_prefix = ''
            if options is not None and 'endpoint' in options:
                full_prefix = full_prefix + options.endpoint
            if classname not in __PREFIX_LIST__:
                raise Exception('Route annotation defined on class without prefix')
            full_prefix = full_prefix + __PREFIX_LIST__[classname]['rule']
            instance = __PREFIX_LIST__[classname]['instance']
            for r in __ROUTES_LIST__[classname]:
                endpoint = r['options'].pop('endpoint', r['function'].__qualname__)
                full_rule = full_prefix + r['rule']
                self.add_route(full_rule, endpoint, r['function'], r['options'], instance=instance)

    def add_route(self, rule, endpoint, f, options, instance=None):
        self.app.add_url_rule(self.prefix + rule, endpoint, self.wrap(f, post=self.as_json, instance=instance), **options)
        print('Added RESTFUL route [' + self.prefix + rule + '] as endpoint [' + endpoint + ']')

    def as_json(self, *args, **kwargs):
        return self.jsonifier(*args, **kwargs)

    def route(self, rule, **options):
        """
        Defines a rest endpoint:
         - the 'api' prefix is added to the url_rule
         - the return object is returned as json

        :param rule: the url rule
        :param options: any options you can pass to flasks 'add_url_rule' (or @app.route decorator)
        :return: the decorated function
        """

        def decorator(f):
            endpoint = options.pop('endpoint', f.__qualname__)
            self.add_route(rule, endpoint, f, options)
            return f

        return decorator

    @staticmethod
    def wrap(f, pre=None, post=None, instance=None):
        """
        Wraps a function with a pre and/or a post function.
        If a 'pre' function is given, it is called with the params of 'f',
        and the return will be passed to 'f' itself.
        If a 'post' function is given, it is called with the return of 'f'

        :param f: the function to wrap
        :param pre: the pre function to execute
        :param post: the post function to execute
        :return: the wrapped function
        """
        def wrapper(*args, **kwargs):
            bound_handler = f
            if instance is not None:
                bound_handler = f.__get__(instance)
            if pre is not None:
                retval = bound_handler(pre(*args, **kwargs))
            else:
                retval = bound_handler(*args, **kwargs)
            if post is not None:
                return post(retval)
            else:
                return retval

        return wrapper
