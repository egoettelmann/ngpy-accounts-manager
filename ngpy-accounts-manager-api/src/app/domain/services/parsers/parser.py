from typing import List

from ...models import Transaction


class Parser:
    """
    The base class that all parser implementation should extend
    """
    filename: str

    def __init__(self, filename: str) -> None:
        """Constructor

        :param filename: the filename to parse
        """
        self.filename = filename

    def parse(self) -> List[Transaction]:
        """Parses the file

        :return: the list of parsed transactions
        """
        raise ParserError('The "parse" method is not implement')

    def get_account_name(self) -> str:
        """Gets the account name

        :return: the account name
        """
        raise ParserError('The "get_account_name" method is not implement')

    def create_transaction(self, row: List[str]) -> Transaction:
        """Creates a transaction from a row

        :param row: the row
        :return: the transaction
        """
        raise ParserError('The "create_transaction" method is not implement')


class ParserError(Exception):
    """
    The parser exception
    """

    def __init__(self, m: str):
        self.message = m

    def __str__(self):
        return self.message
