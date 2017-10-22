from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import Table, Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer


class DBManager():
    _engine = None
    _session = None
    _base = None
    _db_file_path = None

    @staticmethod
    def init(db_file_path):
        DBManager._db_file_path = db_file_path
        # Required to import all entities to initialize them
        from .entities.LabelDbo import LabelDbo
        from .entities.TransactionDbo import TransactionDbo
        from .entities.AccountDbo import AccountDbo
        from .entities.StatusDbo import StatusDbo
        Table('labels_transactions', DBManager.getBase().metadata,
              Column('label_id', Integer, ForeignKey('labels.id')),
              Column('transaction_id', Integer, ForeignKey('transactions.id'))
              )

    @staticmethod
    def getEngine():
        if DBManager._engine is None:
            DBManager._engine = create_engine(DBManager._db_file_path, convert_unicode=True)
        return DBManager._engine

    @staticmethod
    def getSession():
        if DBManager._session is None:
            DBManager._session = scoped_session(sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=DBManager.getEngine()
            ))
        return DBManager._session

    @staticmethod
    def getBase():
        if DBManager._base is None:
            DBManager._base = declarative_base()
            DBManager._base.query = DBManager.getSession().query_property()
        return DBManager._base
