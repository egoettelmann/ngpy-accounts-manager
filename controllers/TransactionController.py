from flask_restful import Resource, marshal_with

from models.domain.Transaction import Transaction
from services.TransactionService import TransactionService


class TransactionController(Resource):
    service = TransactionService()

    @marshal_with(Transaction.resource_fields)
    def get(self, transaction_id=None):
        if transaction_id is None:
            return self.service.get_all()
        else:
            return self.service.get_by_id(transaction_id)
