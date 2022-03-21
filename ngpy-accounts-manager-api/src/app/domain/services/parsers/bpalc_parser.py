import csv
import datetime
from typing import List

from .parser import Parser
from ...models import Transaction


class BpalcParser(Parser):
    """
    The BPALC parser class
    """

    def parse(self) -> List[Transaction]:
        cr = csv.reader(open(self.filename, "rt"), delimiter=';')
        transactions = []
        first_line = True
        for row in cr:
            if first_line:  # skip first line
                first_line = False
                continue
            t = self.create_transaction(row)
            transactions.append(t)
        return transactions

    def get_account_name(self) -> str:
        cr = csv.reader(open(self.filename, "rt"), delimiter=';')
        first_line = True
        for row in cr:
            if first_line:  # skip first line
                first_line = False
                continue
            return row[0]

    def create_transaction(self, row: List[str]) -> Transaction:
        date_compta = datetime.datetime.strptime(row[1], "%d/%m/%Y").date()
        date_operation = datetime.datetime.strptime(row[2], "%d/%m/%Y").date()
        description = row[3]
        reference = row[4]
        date_value = datetime.datetime.strptime(row[5], "%d/%m/%Y").date()
        amount = float(str(row[6]).replace(",", "."))
        transaction = Transaction(date_compta=date_compta,
                                  date_operation=date_operation,
                                  description=description,
                                  reference=reference,
                                  date_value=date_value,
                                  amount=amount)
        return transaction
