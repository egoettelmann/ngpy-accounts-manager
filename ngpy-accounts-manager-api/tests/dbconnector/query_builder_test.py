from api.dbconnector.manager import EntityManager
from api.modules.depynject import Depynject

d_injector = Depynject()

em = EntityManager('sqlite://')
d_injector.register_singleton(em)

# TODO: transform
