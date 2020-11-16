import os
import csv
import datetime
import hashlib
from typing import List

from .parser import Parser
from ..models import Transaction


class IngParser(Parser):
    """
    The ING (FR) parser class
    """

    def parse(self) -> List[Transaction]:
        cr = csv.reader(open(self.filename, "rt"), delimiter=';')
        transactions = []
        for row in cr:
            t = self.create_transaction(row)
            transactions.append(t)
        return transactions

    def get_account_name(self) -> str:
        file_basename: str = os.path.basename(self.filename)
        return file_basename.rsplit("_")[0]

    def create_transaction(self, row: List[str]) -> Transaction:
        date_compta = datetime.datetime.strptime(row[0], "%d/%m/%Y").date()
        description = row[1]
        amount = float(str(row[3]).replace(",", "."))
        r = str(date_compta) + description + str(amount)
        ref = hashlib.md5(r.encode('utf-8')).hexdigest().upper()
        reference = ''.join([x for idx, x in enumerate(ref) if idx in [1, 3, 5, 7, 9, 11, 13]])
        transaction = Transaction(date_compta=date_compta,
                                  date_operation=date_compta,
                                  description=description,
                                  reference=reference,
                                  date_value=date_compta,
                                  amount=amount)
        return transaction
