from flask import request
from flask_restful import Resource, marshal_with

from ..models.domain.Transaction import Transaction
from ..services.TransactionService import TransactionService


class Details(Resource):
    service = TransactionService()

    @marshal_with(Transaction.resource_fields)
    def get(self):
        year = request.args.get('year')
        month = request.args.get('month')
        account_ids = request.args.get('account_ids')
        return self.service.get_all(year, month, account_ids)
