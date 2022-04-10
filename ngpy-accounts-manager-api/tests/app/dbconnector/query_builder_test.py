from app.dbconnector import EntityManager
from app.modules.depynject import Depynject

d_injector = Depynject()

em = EntityManager('sqlite://')
d_injector.register_singleton(em)

# TODO: transform
