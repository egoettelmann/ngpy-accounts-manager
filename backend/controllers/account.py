from flask_restful import marshal_with

from ..modules import restful
from ..modules.depynject import injectable
from ..domain.models import Account


@injectable()
@restful.prefix('/accounts')
class AccountController():

    def __init__(self, account_service):
        self.account_service = account_service

    @restful.route('')
    @marshal_with(Account.resource_fields)
    def get_all(self):
        return self.account_service.get_all_accounts()

    @restful.route('/<int:account_id>')
    @marshal_with(Account.resource_fields)
    def get_one(self, account_id):
        return self.account_service.get_account(account_id)
