from ..models.MapperManager import MapperManager
from ..models.domain.Account import Account
from ..models.entities.AccountDbo import AccountDbo


class AccountService():
    mapper = MapperManager.getInstance()

    def get_all(self):
        accounts = AccountDbo.query.all()
        return self.mapper.map_all(accounts, Account)

    def get_by_id(self, account_id):
        account = AccountDbo.query.get(account_id)
        return self.mapper.map(account, Account)

    def find_by_name(self, name):
        account = AccountDbo.query.filter(AccountDbo.name == name).first()
        return self.mapper.map(account, Account)
