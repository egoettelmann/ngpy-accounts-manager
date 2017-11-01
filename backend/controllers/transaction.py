from flask import request

from .. import restful
from ..depynject import injectable


@injectable()
@restful.prefix('')
class TransactionController():

    def __init__(self, transaction_service):
        self.transaction_service = transaction_service

    @restful.route('/transactions')
    def get(self):
        year = request.args.get('year')
        month = request.args.get('month')
        account_ids = request.args.get('account_ids')
        return self.transaction_service.get_all(year, month, account_ids)
