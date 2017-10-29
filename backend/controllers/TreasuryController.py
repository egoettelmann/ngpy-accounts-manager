from flask import request
from flask_restful import Resource, marshal_with

from ..models.domain.KeyValue import KeyValue
from ..services.AccountService import AccountService


class TreasuryController(Resource):
    service = AccountService()

    @marshal_with(KeyValue.resource_fields)
    def get(self):
        year = request.args.get('year')
        account_ids = request.args.get('account_ids')
        return self.service.get_evolution(year, account_ids)
