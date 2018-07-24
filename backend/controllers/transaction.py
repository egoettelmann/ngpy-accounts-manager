import os

from flask import request
from flask_restful import marshal_with
from werkzeug.utils import secure_filename

from ..domain.models import Transaction
from ..modules import restful
from ..modules.depynject import injectable


@injectable()
@restful.prefix('/transactions')
class TransactionController():

    def __init__(self, transaction_service, account_service):
        self.transaction_service = transaction_service
        self.account_service = account_service

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'csv']

    @restful.route('')
    @marshal_with(Transaction.resource_fields)
    def get_all(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.transaction_service.get_all_transactions(account_ids, year, month)

    @restful.route('/top/<int:num_transactions>/<asc>')
    @marshal_with(Transaction.resource_fields)
    def get_top_transactions(self, num_transactions, asc):
        year = request.args.get('year')
        if year is not None:
            year = int(year)
        month = request.args.get('month')
        if month is not None:
            month = int(month)
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        num_transactions = min(num_transactions, 10)
        ascending = False
        if asc == 'true':
            ascending = True
        return self.transaction_service.get_top_transactions(num_transactions, ascending, account_ids, year, month)

    @restful.route('/<int:transaction_id>')
    @marshal_with(Transaction.resource_fields)
    def get_one(self, transaction_id):
        return self.transaction_service.get_transaction(transaction_id)

    @restful.route('/<int:transaction_id>', methods=['DELETE'])
    def delete_one(self, transaction_id):
        self.transaction_service.delete_transaction(transaction_id)

    @restful.route('/<int:transaction_id>', methods=['POST'])
    @marshal_with(Transaction.resource_fields)
    def update_one(self, transaction_id):
        patch = request.get_json(force=True)  # force flag necessary if 'Content-Type' is not 'application/json'
        t = self.transaction_service.get_transaction(transaction_id)
        for key, value in patch.items():
            t[key] = value
        return self.transaction_service.update_one(t)

    @restful.route('/upload-file', methods=['POST'])
    def upload_file(self):
        tmp_folder = 'tmp'
        file = request.files['file']
        if file and self.allowed_file(file.filename):
            if not os.path.exists(tmp_folder):
                os.makedirs(tmp_folder)
            filename = secure_filename(file.filename)
            saved_filename = os.path.join(tmp_folder, filename)
            file.save(saved_filename)
            return self.account_service.import_file(saved_filename)
