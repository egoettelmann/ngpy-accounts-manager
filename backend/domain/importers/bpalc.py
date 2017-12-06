import csv
import datetime

from ..models import Transaction


class Parser:

    def __init__(self, filename):
        self.filename = filename

    def parse(self):
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

    def get_account_name(self):
        cr = csv.reader(open(self.filename, "rt"), delimiter=';')
        first_line = True
        for row in cr:
            if first_line:  # skip first line
                first_line = False
                continue
            return row[0]

    def create_transaction(self, row):
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
