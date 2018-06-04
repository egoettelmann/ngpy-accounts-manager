from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import Table, Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer

from ..modules.depynject import inject, injectable

__AVAILABLE_MANAGERS__ = {}


class EntityManager:

    def __init__(self, db_file_path, name='default'):
        self.db_file_path = db_file_path
        self.base = self.get_base(name)
        self.engine = create_engine(self.db_file_path, convert_unicode=True)
        self.session_maker = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        self.base.query = self.get_session().query_property()
        self.association_tables = {}

    @inject()
    def get_session(self, request_scoped_session=None):
        if request_scoped_session is None:
            return scoped_session(self.session_maker)  # TODO: not ok, can't a session object be used ?
        return request_scoped_session()

    def query(self, *args, **kwargs):
        return self.get_session().query(*args, **kwargs)

    @staticmethod
    def get_base(name='default'):
        if name not in __AVAILABLE_MANAGERS__:
            __AVAILABLE_MANAGERS__[name] = declarative_base()
        return __AVAILABLE_MANAGERS__[name]


@injectable(scope='request')
class RequestScopedSession:

    def __init__(self, entity_manager):
        self.session = entity_manager.session_maker()

    def __call__(self, *args, **kwargs):
        return self.session
