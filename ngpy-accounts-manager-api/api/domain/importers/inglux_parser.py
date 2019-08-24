import os
import csv
import datetime
import hashlib
from typing import List

from .parser import Parser
from ..models import Transaction


class IngLuxParser(Parser):
    """
    The ING (Lux) parser class
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
        file_basename: str = os.path.basename(self.filename)
        return file_basename.rsplit("_")[1]

    def create_transaction(self, row: List[str]) -> Transaction:
        date_compta = datetime.datetime.strptime(row[5], "%d/%m/%y").date()
        date_operation = datetime.datetime.strptime(row[3], "%d/%m/%y").date()
        date_value = datetime.datetime.strptime(row[4], "%d/%m/%y").date()
        description = row[2]
        amount = float(str(row[6]))
        reference = row[1]
        if reference == "":
            r = str(date_compta) + description + str(amount)
            ref = hashlib.md5(r.encode('utf-8')).hexdigest().upper()
            reference = ''.join([x for idx, x in enumerate(ref) if idx in [1, 3, 5, 7, 9, 11, 13]])
        transaction = Transaction(date_compta=date_compta,
                                  date_operation=date_operation,
                                  description=description,
                                  reference=reference,
                                  date_value=date_value,
                                  amount=amount)
        return transaction
