import os
from typing import List

from flask import request
from werkzeug.utils import secure_filename

from .controller_utils import ControllerUtils
from ..domain.exceptions import FileImportException
from ..domain.models import Transaction
from ..domain.services import TransactionService, AccountService
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/transactions')
class TransactionController:
    """
    The transaction controller that handles all API requests
    """

    def __init__(self,
                 transaction_service: TransactionService,
                 account_service: AccountService
                 ) -> None:
        """Constructor

        :param transaction_service: the transaction service
        :param account_service: the account service
        """
        self.__transaction_service = transaction_service
        self.__account_service = account_service

    @restipy.route('')
    @restipy.format_as(Transaction)
    def get_all(self) -> List[Transaction]:
        """Gets all transactions matching the provided filters.

        :return: the list of transactions
        """
        filter_criteria = ControllerUtils.extract_filter_criteria(request)
        page_request = ControllerUtils.extract_page_request(request)
        return self.__transaction_service.get_all_transactions(filter_criteria, page_request)

    @restipy.route('/top/<int:num_transactions>/<asc>')
    @restipy.format_as(Transaction)
    def get_top_transactions(self, num_transactions: int, asc: bool) -> List[Transaction]:
        """Gets the top transactions matching the provided filters.

        :param num_transactions: the number of transactions to get
        :param asc: the order
        :return: the list of transactions
        """
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
        return self.__transaction_service.get_top_transactions(num_transactions, ascending, account_ids, year, month, label_ids)

    @restipy.route('/<int:transaction_id>')
    @restipy.format_as(Transaction)
    def get_one(self, transaction_id: int) -> Transaction:
        """Gets a transaction by its id.

        :param transaction_id: the transaction id
        :return: the transaction
        """
        return self.__transaction_service.get_transaction(transaction_id)

    @restipy.route('/<int:transaction_id>', methods=['DELETE'])
    def delete_one(self, transaction_id: int) -> None:
        """Deletes a transaction by its id.

        :param transaction_id: the transaction id
        """
        self.__transaction_service.delete_transaction(transaction_id)

    @restipy.route('', methods=['PUT'])
    @restipy.format_as(Transaction)
    @restipy.parse_as(Transaction)
    def create_one(self, transaction: Transaction) -> Transaction:
        """Creates a transaction.

        :param transaction: the transaction to create
        :return: the created transaction
        """
        return self.__transaction_service.create_one(transaction)

    @restipy.route('/<int:transaction_id>', methods=['POST'])
    @restipy.format_as(Transaction)
    @restipy.parse_as(Transaction)
    def update_one(self, transaction: Transaction, transaction_id: int) -> Transaction:
        """Updates a transaction.

        :param transaction: the transaction to update
        :param transaction_id: the transaction id
        :return: the updated transaction
        """
        return self.__transaction_service.update_one(transaction)

    @restipy.route('/upload-file', methods=['POST'])
    def upload_file(self) -> bool:
        """Handles the upload of a file.

        :return: true if the upload succeeded
        """
        tmp_folder = '/tmp'
        file = request.files['file']
        if file and self.allowed_file(file.filename):
            if not os.path.exists(tmp_folder):
                os.makedirs(tmp_folder)
            filename = secure_filename(file.filename)
            saved_filename = os.path.join(tmp_folder, filename)
            file.save(saved_filename)
            return self.__account_service.import_file(saved_filename)
        raise FileImportException("Impossible to import file")

    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Checks that the filename is allowed based on its extension.

        :param filename: the filename
        :return: true if it is allowed, false otherwise
        """
        return '.' in filename and filename.rsplit('.', 1)[1] in ['csv']
