import datetime
import hashlib

from ..exceptions import FileImportException
from ..models import Account, KeyValue
from ...dbconnector.entities import TransactionDbo
from ...modules.depynject import injectable


@injectable()
class AccountService():

    def __init__(self, account_repository, object_mapper, transaction_service, status_service, resolver):
        self.repository = account_repository
        self.mapper = object_mapper
        self.transaction_service = transaction_service
        self.status_service = status_service
        self.resolver = resolver

    def get_all_accounts(self):
        accounts = self.mapper.map_all(
            self.repository.get_all(),
            Account
        )
        for acc in accounts:
            acc.total = self.get_account_total(acc.id)
        return accounts

    def get_account(self, account_id):
        return self.mapper.map(
            self.repository.get_by_id(account_id),
            Account
        )

    def find_by_name(self, name):
        return self.mapper.map(
            self.repository.find_by_name(name),
            Account
        )

    def get_account_total(self, account_id, date=None):
        last_status = self.status_service.get_last_account_status(account_id, date)
        if last_status is not None:
            total = last_status.value
            date_from = last_status.date
        else:
            total = 0
            date_from = datetime.date(1900, 1, 1)
        result = self.repository.get_total(account_id, date_from, date)
        if result is None:
            result = 0
        return total + result

    def get_evolution_for_year(self, account_ids=None, year=None):
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        date_from = datetime.date(year, 1, 1)
        start_amount = 0

        entries = self.transaction_service.get_total_by_period(account_ids, year, None, 'month')

        if account_ids is not None:
            for acc_id in account_ids:
                start_amount = start_amount + self.repository.get_total(acc_id, date_from)

        values = [KeyValue(str(year) + '-01-01', start_amount)]
        for e in entries:
            start_amount = start_amount + e.value
            values.append(KeyValue(e.label, start_amount))
        return values

    def import_file(self, filename):
        parser = self.resolver.resolve(filename)
        account_name = parser.get_account_name()
        account = self.find_by_name(account_name)
        transactions = self.mapper.map_all(
            parser.parse(),
            TransactionDbo
        )
        for t in transactions:
            t.account_id = account.id
            s = str(t.account_id) + t.reference + t.date_value.strftime("%Y-%m-%d") + "{0:.2f}".format(t.amount)
            t.hash = hashlib.md5(s.encode('utf-8')).hexdigest()
        try:
            self.transaction_service.create_all(transactions)
        except:
            raise FileImportException("Impossible to import file")
