import datetime

from ...dbconnector.entities import TransactionDbo
from ...modules.depynject import injectable

from ..models import Transaction, KeyValue, CompositeKeyValue


@injectable()
class TransactionService():

    def __init__(self, transaction_repository, object_mapper):
        self.repository = transaction_repository
        self.mapper = object_mapper

    def get_all_transactions(self, account_ids=None, year=None, month=None, label_ids=None, description=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        labels = self.sanitize_label_ids(label_ids)
        return self.mapper.map_all(
            self.repository.get_all(account_ids, date_from, date_to, labels, description),
            Transaction
        )

    def get_transaction(self, transaction_id):
        return self.mapper.map(
            self.repository.get_by_id(transaction_id),
            Transaction
        )

    def count(self, label_id=None):
        return self.repository.count(label_id)

    def delete_transaction(self, transaction_id):
        self.repository.delete_by_id(transaction_id)

    def get_last_transaction(self, account_ids):
        return self.mapper.map(
            self.repository.get_last_transaction(account_ids),
            Transaction
        )

    def get_top_transactions(self, num_transactions, ascending, account_ids, year, month):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.mapper.map_all(
            self.repository.get_top_transactions(num_transactions, ascending, account_ids, date_from, date_to),
            Transaction
        )

    def get_total_by_labels(self, account_ids=None, year=None, month=None, sign=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.map_to_key_value_list(
            self.repository.get_grouped_by_labels(account_ids, date_from, date_to, sign)
        )

    def get_total_by_period(self, account_ids=None, year=None, month=None, period=None, label_ids=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.map_to_key_value_list(
            self.repository.get_grouped_by_period(account_ids, date_from, date_to, period, label_ids)
        )

    def get_total_by_category_type(self, account_ids=None, year=None, category_type=None, quarterly=True):
        date_from = self.get_date_from(year)
        date_to = self.get_date_to(year)
        return self.map_to_grouped_value_list(
            self.repository.get_grouped_by_category_type(account_ids, date_from, date_to, category_type, quarterly)
        )

    def get_total_by_labels_and_category_type(self, account_ids=None, year=None, category_type=None):
        date_from = self.get_date_from(year)
        date_to = self.get_date_to(year)
        return self.map_to_grouped_value_list(
            self.repository.get_grouped_by_labels_and_category_type(account_ids, date_from, date_to, category_type)
        )

    def get_total(self, account_ids=None, year=None, month=None, sign=None):
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.repository.get_total(account_ids, date_from, date_to, sign)

    def create_one(self, transaction):
        return self.repository.save_one(
            self.mapper.map(
                transaction,
                TransactionDbo
            )
        )

    def create_all(self, transactions):
        # FIXME: should use domain model !
        return self.repository.create_all(transactions)

    def update_one(self, transaction):
        return self.repository.save_one(
            self.mapper.map(
                transaction,
                TransactionDbo
            )
        )

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
        else:
            year = datetime.date.today().year
        if month is not None:
            if month > 11:
                date_to = date_to.replace(year=year+1)
                date_to = date_to.replace(month=1)
            else:
                date_to = date_to.replace(year=year)
                date_to = date_to.replace(month=month+1)
        return date_to

    @staticmethod
    def sanitize_label_ids(label_ids=None):
        if label_ids is not None:
            labels = []
            for label_id in label_ids:
                if label_id == 'null':
                    labels.append(None)
                else:
                    labels.append(label_id)
            return labels
        return None

    @staticmethod
    def map_to_key_value_list(entries):
        values = []
        for kv in entries:
            values.append(KeyValue(kv.key, kv.value))
        return values

    @staticmethod
    def map_to_grouped_value_list(entries):
        values = []
        for kv in entries:
            values.append(CompositeKeyValue(kv.key_one, kv.key_two, kv.value))
        return values
