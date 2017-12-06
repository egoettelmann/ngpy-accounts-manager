from ...modules.depynject import injectable

from ..entities import AccountDbo


@injectable()
class AccountRepository():

    def __init__(self, entity_manager, transaction_repository):
        self.entity_manager = entity_manager
        self.transaction_repository = transaction_repository

    def get_all(self):
        return self.entity_manager.query(AccountDbo).all()

    def get_by_id(self, account_id):
        return self.entity_manager.query(AccountDbo).get(account_id)

    def get_total(self, account_id, date_from=None, date_to=None):
        return self.transaction_repository.get_total([account_id], date_from, date_to)

    def find_by_name(self, name):
        return self.entity_manager.query(AccountDbo).filter(AccountDbo.name == name).first()
