import datetime
import hashlib

from ...modules.depynject import injectable

from ..models import Transaction, KeyValue


@injectable()
class TransactionService():

    def __init__(self, transaction_repository, object_mapper, label_service):
        self.repository = transaction_repository
        self.mapper = object_mapper
        self.label_service = label_service

    def get_all_transactions(self, account_ids=None, year=None, month=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.mapper.map_all(
            self.repository.get_all(account_ids, date_from, date_to),
            Transaction
        )

    def get_transaction(self, transaction_id):
        return self.mapper.map(
            self.repository.get_by_id(transaction_id),
            Transaction
        )

    def get_total_by_labels(self, account_ids=None, year=None, month=None, sign=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.mapper.map_all(
            self.repository.get_grouped_by_labels(account_ids, date_from, date_to, sign),
            KeyValue
        )

    def get_total_by_period(self, account_ids=None, year=None, month=None, period=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.mapper.map_all(
            self.repository.get_grouped_by_period(account_ids, date_from, date_to, period),
            KeyValue
        )

    def get_total(self, account_ids=None, year=None, month=None, sign=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.repository.get_total(account_ids, date_from, date_to, sign)

    @staticmethod
    def get_date_from(year=None, month=None):
        date_from = datetime.date(1900, 1, 1)
        if year is not None:
            date_from = date_from.replace(year=year)
        if month is not None:
            date_from = date_from.replace(month=month)
        return date_from

    @staticmethod
    def get_date_to(year=None, month=None):
        date_to = datetime.date(datetime.date.today().year + 1, 1, 1)
        if year is not None:
            date_to = date_to.replace(year=year + 1)
        if month is not None:
            date_to = date_to.replace(month=month+1)
        return date_to

    def create_from_csv(self, row):
        account = self.account_service.find_by_name(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d/%m/%Y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d/%m/%Y").date()
        description = row[3]
        reference = row[4]
        date_value = datetime.datetime.strptime(row[5], "%d/%m/%Y").date()
        amount = float(str(row[6]).replace(",", "."))
        transaction = Transaction(account.id, date_compta, date_operation, description, reference, date_value, amount)
        return transaction

    def create_from_csv2(self, row):
        account = self.account_service.find_by_name(row[0])
        date_compta = datetime.datetime.strptime(row[1], "%d-%m-%y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d-%m-%y").date()
        description = row[4]
        reference = row[5]
        date_value = datetime.datetime.strptime(row[6], "%d-%m-%y").date()
        amount = float(str(row[7]).replace(",", "."))
        label = self.label_service.find_by_name(row[3].lower().capitalize())
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
