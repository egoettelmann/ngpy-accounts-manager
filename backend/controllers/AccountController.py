from flask_restful import Resource, marshal_with

from ..models.domain.Account import Account
from ..services.AccountService import AccountService


class Details(Resource):
    service = AccountService()

    @marshal_with(Account.resource_fields)
    def get(self, account_id=None):
        if account_id is None:
            return self.service.get_all()
        else:
            return self.service.get_by_id(account_id)
