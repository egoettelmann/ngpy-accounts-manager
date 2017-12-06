import csv
import datetime
import hashlib

from ..models import Transaction


class Parser:

    def __init__(self, filename):
        self.filename = filename

    def parse(self):
        cr = csv.reader(open(self.filename, "rt"), delimiter=';')
        transactions = []
        for row in cr:
            t = self.create_transaction(row)
            transactions.append(t)
        return transactions

    def get_account_name(self):
        return self.filename.rsplit("_")[0].replace("uploads\\", "")

    def create_transaction(self, row):
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
