import datetime
import hashlib

from flask_restful import fields
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, Date, String, Numeric

from models.DBManager import DBManager
from models.entities.AccountDbo import AccountDbo
from models.entities.LabelDbo import LabelDbo


class Transaction(DBManager.getBase()):
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
    resource_fields = {
        'reference': fields.String,
        'date': fields.DateTime,
        'amount': fields.Float,
    }

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

    @staticmethod
    def createFromCSV(row):
        account = AccountDbo.findFromName(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d/%m/%Y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d/%m/%Y").date()
        description = row[3]
        reference = row[4]
        date_value = datetime.datetime.strptime(row[5], "%d/%m/%Y").date()
        amount = float(str(row[6]).replace(",", "."))
        transaction = Transaction(account.id, date_compta, date_operation, description, reference, date_value, amount)
        return transaction

    @staticmethod
    def createFromCSV2(row):
        account = AccountDbo.findFromName(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d-%m-%y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d-%m-%y").date()
        description = row[4]
        reference = row[5]
        date_value = datetime.datetime.strptime(row[6], "%d-%m-%y").date()
        amount = float(str(row[7]).replace(",", "."))
        label = LabelDbo.findFromName(row[3].lower().capitalize())
        transaction = Transaction(account.id, date_compta, date_operation, description, reference, date_value, amount, "", label.id)
        return transaction

    @staticmethod
    def createFromCSV3(row):
        date_compta = datetime.datetime.strptime(row[0], "%d/%m/%Y").date()
        description = row[1]
        amount = float(str(row[3]).replace(",", "."))
        r = str(date_compta) + description + str(amount)
        ref = hashlib.md5(r.encode('utf-8')).hexdigest().upper()
        reference = ''.join([x for idx, x in enumerate(ref) if idx in [1,3,5,7,9,11,13]])
        transaction = Transaction(0, date_compta, date_compta, description, reference, date_compta, amount)
        return transaction

    @staticmethod
    def createFromCSV4(row):
        date_compta = datetime.datetime.strptime(row[5], "%d/%m/%y").date()
        date_operation = datetime.datetime.strptime(row[3], "%d/%m/%y").date()
        date_value = datetime.datetime.strptime(row[4], "%d/%m/%y").date()
        description = row[2]
        amount = float(str(row[6]))
        reference = row[1]
        transaction = Transaction(0, date_compta, date_operation, description, reference, date_value, amount)
        return transaction
