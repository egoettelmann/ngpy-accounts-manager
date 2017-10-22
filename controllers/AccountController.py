from flask_restful import Resource, marshal_with

from models.domain.Account import Account
from models.domain.Label import Label
from services.AccountService import AccountService
from services.LabelService import LabelService


class AccountController(Resource):
    service = AccountService()

    @marshal_with(Account.resource_fields)
    def get(self):
        return self.service.get_all()