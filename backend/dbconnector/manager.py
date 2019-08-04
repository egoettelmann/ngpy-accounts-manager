from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, Query, Session
from sqlalchemy.pool import QueuePool

from ..modules.depynject import inject, injectable

__AVAILABLE_MANAGERS__ = {}


class EntityManager:
    """
    The entity manager that handles the database session.
    """

    def __init__(self, db_url_path, name='default'):
        """Constructor

        :param db_url_path: the path to the database
        :param name: the name of the entity manager
        """
        self.__db_file_path = db_url_path
        self.__base = self.get_base(name)
        connect_args = {}
        if self.__db_file_path.startswith('sqlite'):
            # This option is specific to sqlite
            connect_args['check_same_thread'] = False
        self.__engine = create_engine(
            self.__db_file_path,
            connect_args=connect_args,
            convert_unicode=True,
            poolclass=QueuePool,
            pool_size=20,
            max_overflow=0
        )
        self.session_maker = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.__engine
        )
        self.__association_tables = {}

    @inject()
    def get_session(self, request_scoped_session=None) -> Session:
        """Gets the current session.
        If a request scoped session is defined, it is returned.
        Otherwise an SQLAlchemy scoped session is returned that is bound to the current thread.

        :param request_scoped_session: the optional request scoped session
        :return:
        """
        if request_scoped_session is None:
            return scoped_session(self.session_maker)()
        return request_scoped_session()

    def query(self, *args, **kwargs) -> Query:
        """Executes a query on the current session.

        :param args:
        :param kwargs:
        :return: the built query
        """
        return self.get_session().query(*args, **kwargs)

    @staticmethod
    def get_base(name='default'):
        """Gets the declarative base, to be used by any entity.

        :param name: the name of the base
        :return: the declarative base
        """
        if name not in __AVAILABLE_MANAGERS__:
            __AVAILABLE_MANAGERS__[name] = declarative_base()
        return __AVAILABLE_MANAGERS__[name]


@injectable(scope='request')
class RequestScopedSession:
    """
    The request scoped session which maintains one database session for a request.
    """

    def __init__(self, entity_manager: EntityManager):
        """Constructor

        :param entity_manager: the entity manager
        """
        self.session = entity_manager.session_maker()

    def __call__(self, *args, **kwargs) -> Session:
        """Returns the session instance.

        :param args:
        :param kwargs:
        :return: the request scoped session
        """
        return self.session

    def close(self) -> None:
        """Closes the session.
        """
        if self.session is not None:
            self.session.close()
