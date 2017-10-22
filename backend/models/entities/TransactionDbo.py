import hashlib

from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, Date, String, Numeric

from ..DBManager import DBManager


class TransactionDbo(DBManager.getBase()):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    date_compta = Column(Date())
    date_operation = Column(Date())
    date_value = Column(Date())
    description = Column(String(250))
    reference = Column(String(50))
    amount = Column(Numeric(precision=2))
    note = Column(String(250))
    label_id = Column(Integer, ForeignKey('labels.id'))
    hash = Column(String(250), unique=True)

    def __init__(self, account_id=None, date_compta=None, date_operation=None, description=None, reference=None, date_value=None, amount=None, note=None, label_id=None):
        self.account_id = account_id
        self.date_compta = date_compta
        self.date_operation = date_operation
        self.description = description
        self.reference = reference
        self.date_value = date_value
        self.amount = amount
        self.note = note
        self.label_id = label_id
        s = str(account_id) + reference + date_value.strftime("%Y-%m-%d") + "{0:.2f}".format(amount)
        self.hash = hashlib.md5(s.encode('utf-8')).hexdigest()

    def __repr__(self):
        return '<Transaction %r>' % self.reference
