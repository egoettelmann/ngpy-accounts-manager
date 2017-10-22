from flask_restful import Resource, marshal_with

from models.entities.TransactionDbo import Transaction


class TransactionController(Resource):

    @marshal_with(Transaction.resource_fields)
    def get(self):
        return Transaction.query.all()