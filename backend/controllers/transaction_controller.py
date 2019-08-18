import os
from typing import List

from flask import request
from werkzeug.utils import secure_filename

from ..domain.exceptions import FileImportException
from ..domain.models import Transaction
from ..domain.services import TransactionService, AccountService
from ..modules import restipy
from ..modules.depynject import injectable
from ..rql_parser import RqlRequestParser


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
        self.__rql_parser = RqlRequestParser({
            'accountId': 'account_id',
            'labelId': 'label_id',
            'categoryId': 'label.category_id',
            'reference': 'reference',
            'description': 'description',
            'amount': 'amount',
            'dateValue': 'date_value',
            'categoryType': 'label.category.type'
        })

    @restipy.route('')
    @restipy.format_as(Transaction)
    def get_all(self) -> List[Transaction]:
        """Gets all transactions matching the provided filters.

        :return: the list of transactions
        """
        search_request = self.__rql_parser.parse(request)
        return self.__transaction_service.search_all(search_request)

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
