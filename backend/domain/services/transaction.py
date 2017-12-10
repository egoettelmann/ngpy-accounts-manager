import datetime

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
        return self.map_to_key_value_list(
            self.repository.get_grouped_by_labels(account_ids, date_from, date_to, sign)
        )

    def get_total_by_period(self, account_ids=None, year=None, month=None, period=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.map_to_key_value_list(
            self.repository.get_grouped_by_period(account_ids, date_from, date_to, period)
        )

    def get_total(self, account_ids=None, year=None, month=None, sign=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.repository.get_total(account_ids, date_from, date_to, sign)

    def create_all(self, transactions):
        return self.repository.create_all(transactions)

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
            date_to = date_to.replace(year=year+1)
        if month is not None:
            date_to = date_to.replace(year=year)
            date_to = date_to.replace(month=month+1)
        return date_to

    @staticmethod
    def map_to_key_value_list(entries):
        values = []
        for kv in entries:
            values.append(KeyValue(kv.label, kv.value))
        return values