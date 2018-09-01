from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.pool import QueuePool

from ..modules.depynject import inject, injectable

__AVAILABLE_MANAGERS__ = {}


class EntityManager:

    def __init__(self, db_file_path, name='default'):
        self.db_file_path = db_file_path
        self.base = self.get_base(name)
        connect_args = {}
        if self.db_file_path.startswith('sqlite'):
            # This option is specific to sqlite
            connect_args['check_same_thread'] = False
        self.engine = create_engine(
            self.db_file_path,
            connect_args=connect_args,
            convert_unicode=True,
            poolclass=QueuePool,
            pool_size=20,
            max_overflow=0
        )
        self.session_maker = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        self.association_tables = {}

    @inject()
    def get_session(self, request_scoped_session=None):
        if request_scoped_session is None:
            return scoped_session(self.session_maker)
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

    def close(self):
        if self.session is not None:
            self.session.close()
