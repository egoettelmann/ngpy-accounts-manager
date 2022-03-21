from flask import g

from .depynject import Depynject


class RequestDiProvider:

    def __init__(self):
        self.di_list = {}

    def provide(self, class_ref, i_args, di_instance):
        identifier = Depynject.to_camel_case(class_ref.__name__)

        if not hasattr(g, 'injectable_objects'):
            g.injectable_objects = {}

        if identifier not in g.injectable_objects:
            g.injectable_objects[identifier] = di_instance.create_new_instance(class_ref, i_args)

        return g.injectable_objects[identifier]

    def clear(self):
        if hasattr(g, 'injectable_objects'):
            for k in g.injectable_objects:
                v = g.injectable_objects[k]
                close_op = getattr(v, 'close', None)
                if callable(close_op):
                    v.close()
            g.pop('injectable_objects', None)


class StaticSingletonDiProvider:

    def __init__(self):
        self.di_list = {}

    def provide(self, class_ref, i_args, di_instance):
        identifier = Depynject.to_camel_case(class_ref.__name__)

        if identifier not in self.di_list:
            self.di_list[identifier] = di_instance.create_new_instance(class_ref, i_args)

        return self.di_list[identifier]


class SimplePrototypeDiProvider:

    def __init__(self):
        self.di_list = {}

    def provide(self, class_ref, i_args, di_instance):
        return di_instance.create_new_instance(class_ref, i_args)
