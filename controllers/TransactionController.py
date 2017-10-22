from flask_restful import Resource, marshal_with

from models.domain.Transaction import Transaction
from services.TransactionService import TransactionService


class TransactionController(Resource):
    service = TransactionService()

    @marshal_with(Transaction.resource_fields)
    def get(self):
        return TransactionService.get_all()