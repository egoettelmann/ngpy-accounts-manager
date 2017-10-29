import datetime

from sqlalchemy import func, extract

from ..services.StatisticsService import StatisticsService
from ..models.DBManager import DBManager
from ..models.MapperManager import MapperManager
from ..models.domain.Account import Account
from ..models.domain.KeyValue import KeyValue
from ..models.entities.AccountDbo import AccountDbo
from ..models.entities.TransactionDbo import TransactionDbo


class AccountService():
    mapper = MapperManager.getInstance()
    statisticsService = StatisticsService()

    def get_all(self):
        accounts = AccountDbo.query.all()
        accs = self.mapper.map_all(accounts, Account)
        for a in accs:
            a.total = self.get_account_total(a.id)
        return accs

    def get_by_id(self, account_id):
        account = AccountDbo.query.get(account_id)
        return self.mapper.map(account, Account)

    def find_by_name(self, name):
        account = AccountDbo.query.filter(AccountDbo.name == name).first()
        return self.mapper.map(account, Account)

    def get_account_total(self, account_id):
        query = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
        query = query.filter(TransactionDbo.account_id == account_id)
        return query.scalar()

    def get_evolution(self, year=None, account_ids=None):
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        start_amount = 0

        entries = DBManager.getSession().query(
            TransactionDbo.date_value.label('label'),
            func.sum(TransactionDbo.amount).label('value')
        )
        if account_ids is None:
            account_ids = []
            accounts = AccountDbo.query.all()
            for acc in accounts:
                account_ids.append(acc.id)
                status = self.statisticsService.get_account_status(acc.id, year, 1, 1)
                start_amount = start_amount + status
        entries = StatisticsService.filter_transactions_by_accounts(entries, account_ids)
        if year is not None:
            entries = entries.filter(extract('year', TransactionDbo.date_value) == year)
        entries = entries.group_by(extract('month', TransactionDbo.date_value))
        values = [KeyValue(str(year) + '-01-01', start_amount)]
        for e in entries:
            start_amount = start_amount + e.value
            values.append(KeyValue(e.label, start_amount))
        return values
