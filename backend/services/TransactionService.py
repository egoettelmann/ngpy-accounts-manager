import datetime
import hashlib

from sqlalchemy.sql.expression import extract

from ..models.MapperManager import MapperManager
from ..models.domain.Transaction import Transaction
from ..models.entities.TransactionDbo import TransactionDbo
from ..services.AccountService import AccountService
from ..services.LabelService import LabelService


class TransactionService():
    mapper = MapperManager.getInstance()
    accountService = AccountService()
    labelService = LabelService()

    def get_all(self, year=None, month=None, account_ids=None):
        transactions = TransactionDbo.query
        if year is not None:
            transactions = transactions.filter(
                extract('year', TransactionDbo.date_value) == year
            )
        if month is not None:
            transactions = transactions.filter(
                extract('month', TransactionDbo.date_value) == month
            )
        if account_ids is not None:
            transactions = transactions.filter(TransactionDbo.account_id.in_(account_ids))
        transactions = transactions.order_by(TransactionDbo.date_value)
        return self.mapper.map_all(transactions, Transaction)

    def get_by_id(self, transaction_id):
        transaction = TransactionDbo.query.get(transaction_id)
        return self.mapper.map(transaction, Transaction)

    def find_by_reference(self, reference):
        transaction = TransactionDbo.query.filter(TransactionDbo.reference == reference).first()
        if not transaction:
            return None
        return self.mapper.map(transaction, Transaction)

    def create_from_csv(self, row):
        account = self.accountService.find_by_name(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d/%m/%Y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d/%m/%Y").date()
        description = row[3]
        reference = row[4]
        date_value = datetime.datetime.strptime(row[5], "%d/%m/%Y").date()
        amount = float(str(row[6]).replace(",", "."))
        transaction = Transaction(account.id, date_compta, date_operation, description, reference, date_value, amount)
        return transaction

    def create_from_csv2(self, row):
        account = self.accountService.find_by_name(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d-%m-%y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d-%m-%y").date()
        description = row[4]
        reference = row[5]
        date_value = datetime.datetime.strptime(row[6], "%d-%m-%y").date()
        amount = float(str(row[7]).replace(",", "."))
        label = self.labelService.find_by_name(row[3].lower().capitalize())
        transaction = Transaction(account.id, date_compta, date_operation, description, reference, date_value, amount, "", label.id)
        return transaction

    def create_from_csv3(self, row):
        date_compta = datetime.datetime.strptime(row[0], "%d/%m/%Y").date()
        description = row[1]
        amount = float(str(row[3]).replace(",", "."))
        r = str(date_compta) + description + str(amount)
        ref = hashlib.md5(r.encode('utf-8')).hexdigest().upper()
        reference = ''.join([x for idx, x in enumerate(ref) if idx in [1, 3, 5, 7, 9, 11, 13]])
        transaction = Transaction(0, date_compta, date_compta, description, reference, date_compta, amount)
        return transaction

    def create_from_csv4(self, row):
        date_compta = datetime.datetime.strptime(row[5], "%d/%m/%y").date()
        date_operation = datetime.datetime.strptime(row[3], "%d/%m/%y").date()
        date_value = datetime.datetime.strptime(row[4], "%d/%m/%y").date()
        description = row[2]
        amount = float(str(row[6]))
        reference = row[1]
        transaction = Transaction(0, date_compta, date_operation, description, reference, date_value, amount)
        return transaction
