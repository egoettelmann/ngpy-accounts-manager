from .account_service import AccountService
from .classification_service import ClassificationService
from .parsers import Resolver
from .parsers.resolve import ResolveError
from .transaction_service import TransactionService
from ..exceptions import FileImportException, DuplicateElementsException
from ..models import ImportResult
from ...modules.depynject import injectable


@injectable()
class ImportService:
    """
    The account service class that defines all business operations.
    """

    def __init__(self,
                 resolver: Resolver,
                 classification_service: ClassificationService,
                 account_service: AccountService,
                 transaction_service: TransactionService
                 ) -> None:
        """Constructor

        :param resolver: the import resolver
        :param classification_service: the classification service
        :param account_service: the account service
        :param transaction_service: the transaction service
        """
        self.__resolver = resolver
        self.__classification_service = classification_service
        self.__account_service = account_service
        self.__transaction_service = transaction_service

    def import_file(self, filename: str) -> ImportResult:
        """Imports a file of transactions.

        :param filename: the file to import
        :return: if the import was successful or not
        """
        try:
            parser = self.__resolver.resolve(filename)
            account_name = parser.get_account_name()
            account = self.__account_service.find_by_name(account_name)
            transactions = parser.parse()

            result = ImportResult(0, 0, 0)
            for t in transactions:
                t.account_id = account.id
                label_id = self.__classification_service.predict(t.description)
                if label_id is not None:
                    t.label_id = label_id
                    result.assigned += 1
                result.imported += 1
                result.total_amount += t.amount
            self.__transaction_service.create_all(transactions)
            return result
        except ResolveError as e:
            raise FileImportException(e.message, cause=e)
        except DuplicateElementsException as e:
            if not e.context:
                raise FileImportException("Some transactions appear to have already been imported: " + e.message, cause=e)
            raise FileImportException("Import failed on transaction " + self.format(e.context) + ": " + e.message, cause=e)
        except Exception as e:
            raise FileImportException("Unexpected error, check technical logs", cause=e)

    @staticmethod
    def format(transaction: dict) -> str:
        """Formats the provided transaction as string.
        The formatted string can be used for error display.
        The transaction should be provided as dict (extracted from an exception).

        :param transaction: the transaction
        :return: the formatted string
        """
        return '("' \
            + transaction['reference'] \
            + '", "' \
            + transaction['description'] \
            + '", "' \
            + transaction['date_value'].strftime("%Y-%m-%d") \
            + '", "' \
            + "{0:.2f}".format(transaction['amount']) \
            + '")'
