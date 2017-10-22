from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, Date, Numeric

from ..DBManager import DBManager


class StatusDbo(DBManager.getBase()):
    __tablename__ = 'status'
    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    date = Column(Date())
    value = Column(Numeric(precision=2))

    def __init__(self, account_id, date, value=0):
        self.account_id = account_id
        self.date = date
        self.value = value

    def __repr__(self):
        return '<Status %r>' % self.date
