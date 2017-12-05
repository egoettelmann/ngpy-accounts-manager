import random
import string

from flask import g

from .depynject import Depynject


class RequestDiProvider:

    def __init__(self):
        self.di_list = {}

    def provide(self, class_ref, i_args, di_instance):
        id = Depynject.to_camel_case(class_ref.__name__)
        provider_id = self.get_provider_id()

        if provider_id not in self.di_list:
            self.di_list[provider_id] = {}

        if id not in self.di_list[provider_id]:
            self.di_list[provider_id][id] = di_instance.create_new_instance(class_ref, i_args)

        return self.di_list[provider_id][id]

    def clear(self):
        if 'di_provider_id' in g:
            del self.di_list[g.di_provider_id]

    @staticmethod
    def get_provider_id():
        if 'di_provider_id' not in g:
            g.di_provider_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(16))
        return g.di_provider_id
