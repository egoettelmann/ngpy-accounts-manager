from ...modules.depynject import injectable

from ..entities import AccountDbo


@injectable()
class AccountRepository():

    def __init__(self, entity_manager, transaction_repository):
        self.query = AccountDbo.query
        self.entity_manager = entity_manager
        self.transaction_repository = transaction_repository

    def get_all(self):
        return self.query.all()

    def get_by_id(self, account_id):
        return self.query.get(account_id)

    def get_total(self, account_id, date_from=None, date_to=None):
        return self.transaction_repository.get_total([account_id], date_from, date_to)
