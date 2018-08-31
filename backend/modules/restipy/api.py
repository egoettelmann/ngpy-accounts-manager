from flask.helpers import make_response
from flask.json import jsonify

from .errors import DefaultExceptionHandler


def default_di_provider(class_ref):
    """
    The default dependency provider.
    It tries to instantiate the given class.
    If the constructor takes any argument, it will fail.

    :param class_ref: the class reference
    :return: the class instance
    """
    return class_ref()


class Api:
    PREFIX_LIST = {}
    ROUTES_LIST = {}

    def __init__(self,
                 app,
                 prefix="",
                 jsonifier=jsonify,
                 di_provider=default_di_provider,
                 exception_handler=None):
        self.app = app
        self.prefix = prefix
        self.jsonifier = jsonifier
        self.di_provider = di_provider
        if exception_handler is None:
            exception_handler = DefaultExceptionHandler()
        self.exception_handler = exception_handler

    def register(self, class_ref, options=None):
        """
        Registers a class as a restful event handler.

        :param class_ref: the class reference to register
        :param options: the options object
                        - prefix, the prefix for the entire controller
        :return:
        """
        classname = class_ref.__qualname__
        if classname in Api.ROUTES_LIST:
            full_prefix = ''
            if options is not None and 'prefix' in options:
                full_prefix = full_prefix + options.prefix
            if classname not in Api.PREFIX_LIST:
                raise Exception('Route annotation defined on class without prefix')
            full_prefix = full_prefix + Api.PREFIX_LIST[classname]['rule']
            instance = self.di_provider(Api.PREFIX_LIST[classname]['reference'])
            for r in Api.ROUTES_LIST[classname]:
                endpoint = r['options'].pop('endpoint', r['function'].__qualname__)
                full_rule = full_prefix + r['rule']
                self.add_route(full_rule, endpoint, r['function'], r['options'], instance=instance)

    def add_route(self, rule, endpoint, f, options, instance=None):
        """
        Adds a route to the application.
        Wraps the passed method with all RESTFUL utilities.

        :param rule: the url rule
        :param endpoint: the endpoint
        :param f: the function executed for the request
        :param options: any options you can pass to flasks 'add_url_rule' (or @app.route decorator)
        :param instance: if a class method is passed, the instance of the class
        :return:
        """
        r_function = self.wrap(f, post=self.as_json, instance=instance)
        self.app.add_url_rule(self.prefix + rule, endpoint, r_function, **options)
        print('Added RESTFUL route [' + self.prefix + rule + '] as endpoint [' + endpoint + ']')

    def as_json(self, *args, **kwargs):
        """
        Returns the result as JSON.
        Uses the jsonifier of the instance.

        :param args: *args
        :param kwargs:  **kwargs
        :return: the JSON
        """
        resp = self.jsonifier(*args, **kwargs)
        return resp

    def return_exception(self, e):
        """
        Returns an exception as an HTTP response.
        Uses the exception_handler for transforming the exception.

        :param e: the exception
        :return: the exception as HTTP response
        """
        (res, code) = self.exception_handler.handle(e)
        self.app.logger.error(e)
        return make_response(
            self.as_json(res),
            code
        )

    def wrap(self, f, pre=None, post=None, instance=None):
        """
        Wraps a function with a pre and/or a post function.
        If a 'pre' function is given, it is called with the params of 'f',
        and the return will be passed to 'f' itself.
        If a 'post' function is given, it is called with the return of 'f'

        :param f: the function to wrap
        :param pre: the pre function to execute
        :param post: the post function to execute
        :param instance: the instance of the controller
        :return: the wrapped function
        """

        def wrapper(*args, **kwargs):
            bound_handler = f
            if instance is not None:
                bound_handler = f.__get__(instance)
            try:
                if pre is not None:
                    r_value = bound_handler(pre(*args, **kwargs))
                else:
                    r_value = bound_handler(*args, **kwargs)
                if post is not None:
                    return post(r_value)
                else:
                    return r_value
            except Exception as e:
                return self.return_exception(e)

        return wrapper

    @staticmethod
    def prefix(rule, **options):
        """
        To be used as decorator to define a prefix for a controller class.
        This decorator should be present on any class defining restful routes.

        :param rule: the url rule
        :param options: the options
        :return: the decorated class
        """

        def decorator(c):
            Api.PREFIX_LIST[c.__qualname__] = {
                'reference': c,
                'rule': rule,
                'options': options
            }
            return c

        return decorator

    @staticmethod
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
                if classname not in Api.ROUTES_LIST:
                    Api.ROUTES_LIST[classname] = []
                Api.ROUTES_LIST[classname].append({
                    'function': f,
                    'rule': rule,
                    'options': options
                })
            return f

        return decorator
