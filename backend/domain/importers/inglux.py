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
        return self.filename.rsplit("_")[1]

    def create_transaction(self, row):
        date_compta = datetime.datetime.strptime(row[5], "%d/%m/%y").date()
        date_operation = datetime.datetime.strptime(row[3], "%d/%m/%y").date()
        date_value = datetime.datetime.strptime(row[4], "%d/%m/%y").date()
        description = row[2]
        amount = float(str(row[6]))
        reference = row[1]
        transaction = Transaction(date_compta=date_compta,
                                  date_operation=date_operation,
                                  description=description,
                                  reference=reference,
                                  date_value=date_value,
                                  amount=amount)
        return transaction
