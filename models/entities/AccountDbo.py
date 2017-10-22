from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Integer, String

from models.DBManager import DBManager


class AccountDbo(DBManager.getBase()):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    description = Column(String(250))
    transactions = relationship("Transaction", backref="account")
    color = Column(String(50))
    status = relationship("Status", backref="account")

    def __init__(self, name=None, description=None):
        self.name = name
        self.description = description

    def __repr__(self):
        return '<Account %r>' % (self.name)
