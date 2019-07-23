import os

from flask import request
from werkzeug.utils import secure_filename

from ..domain.exceptions import FileImportException
from ..domain.models import Transaction
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/transactions')
class TransactionController():

    def __init__(self, transaction_service, account_service):
        self.transaction_service = transaction_service
        self.account_service = account_service

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in ['csv']

    @restipy.route('')
    @restipy.format_as(Transaction)
    def get_all(self):
        year = request.args.get('year')
        if year is not None:
            year = int(year)
        month = request.args.get('month')
        if month is not None:
            month = int(month)
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = list(map(lambda a: int(a), account_ids.split(',')))
        label_ids = request.args.get('label_ids')
        if label_ids is not None:
            label_ids = list(map(lambda a: None if a == '' else int(a), label_ids.split(',')))
        description = request.args.get('description')
        return self.transaction_service.get_all_transactions(account_ids, year, month, label_ids, description)

    @restipy.route('/top/<int:num_transactions>/<asc>')
    @restipy.format_as(Transaction)
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
        label_ids = request.args.get('label_ids')
        if label_ids is not None:
            label_ids = list(map(lambda a: None if a == '' else int(a), label_ids.split(',')))
        return self.transaction_service.get_top_transactions(num_transactions, ascending, account_ids, year, month, label_ids)

    @restipy.route('/<int:transaction_id>')
    @restipy.format_as(Transaction)
    def get_one(self, transaction_id):
        return self.transaction_service.get_transaction(transaction_id)

    @restipy.route('/<int:transaction_id>', methods=['DELETE'])
    def delete_one(self, transaction_id):
        self.transaction_service.delete_transaction(transaction_id)

    @restipy.route('', methods=['PUT'])
    @restipy.format_as(Transaction)
    @restipy.parse_as(Transaction)
    def create_one(self, transaction):
        return self.transaction_service.create_one(transaction)

    @restipy.route('/<int:transaction_id>', methods=['POST'])
    @restipy.format_as(Transaction)
    @restipy.parse_as(Transaction)
    def update_one(self, transaction, transaction_id):
        return self.transaction_service.update_one(transaction)

    @restipy.route('/upload-file', methods=['POST'])
    def upload_file(self):
        tmp_folder = '/tmp'
        file = request.files['file']
        if file and self.allowed_file(file.filename):
            if not os.path.exists(tmp_folder):
                os.makedirs(tmp_folder)
            filename = secure_filename(file.filename)
            saved_filename = os.path.join(tmp_folder, filename)
            file.save(saved_filename)
            return self.account_service.import_file(saved_filename)
        raise FileImportException("Impossible to import file")
