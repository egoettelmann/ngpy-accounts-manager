from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import Table, Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer

__AVAILABLE_MANAGERS__ = {}


class EntityManager():

    def __init__(self, db_file_path, name='default'):
        self.db_file_path = db_file_path
        self.base = self.get_base(name)
        self.engine = create_engine(self.db_file_path, convert_unicode=True)
        self.session_maker = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        self.base.query = self.create_session().query_property() # TODO: not okay, session should be created when needed

    def create_session(self):
        return scoped_session(self.session_maker)

    def query(self):
        return self.create_session().query

    @staticmethod
    def get_base(name='default'):
        if name not in __AVAILABLE_MANAGERS__:
            __AVAILABLE_MANAGERS__[name] = declarative_base()
        return __AVAILABLE_MANAGERS__[name]

    @staticmethod
    def init():
        # Required to import all entities to initialize them
        Table(
            'labels_transactions',
            EntityManager.get_base().metadata,
            Column('label_id', Integer, ForeignKey('labels.id')),
            Column('transaction_id', Integer, ForeignKey('transactions.id'))
        )
