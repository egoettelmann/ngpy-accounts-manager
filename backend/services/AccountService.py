from sqlalchemy import func

from ..models.DBManager import DBManager
from ..models.MapperManager import MapperManager
from ..models.domain.Account import Account
from ..models.entities.AccountDbo import AccountDbo
from ..models.entities.TransactionDbo import TransactionDbo


class AccountService():
    mapper = MapperManager.getInstance()

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
