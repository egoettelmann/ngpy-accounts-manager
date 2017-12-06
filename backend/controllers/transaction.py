import os

from flask import request
from flask_restful import marshal_with
from werkzeug.utils import secure_filename

from ..domain.models import Transaction
from ..modules import restful
from ..modules.depynject import injectable


@injectable()
@restful.prefix('')
class TransactionController():

    def __init__(self, transaction_service, account_service):
        self.transaction_service = transaction_service
        self.account_service = account_service

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'csv']

    @restful.route('/transactions')
    @marshal_with(Transaction.resource_fields)
    def get_all(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        account_ids = request.args.get('account_ids')
        return self.transaction_service.get_all_transactions(account_ids, year, month)

    @restful.route('/transactions', methods=['POST'])
    def upload_file(self):
        file = request.files['file']
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_filename = os.path.join('uploads', filename)
            file.save(saved_filename)
            return self.account_service.import_file(saved_filename)
