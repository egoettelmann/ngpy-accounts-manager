import csv
from itertools import islice

from models.DBManager import DBManager
from models.entities.AccountDbo import AccountDbo
from models.entities.TransactionDbo import TransactionDbo


def nth(iterable, n, default=None):
    "Returns the nth item or a default value"
    return next(islice(iterable, n, None), default)


def resolve_importer(filename):
    cr = csv.reader(open(filename, "rt"), delimiter=';')
    num_rows = len(nth(cr, 0))
    if (num_rows == 7):
        return import_bpalc(filename)
    elif (num_rows == 6 or num_rows == 5):
        return import_ing(filename)
    elif (num_rows == 18):
        return import_ing_lux(filename)
    else:
        # this is not working
        print("Could not resolve importer, number of rows: " + str(num_rows))
        return import_bnp(filename)


def import_bpalc(filename):
    cr = csv.reader(open(filename, "rt"), delimiter=';')
    firstline = True
    for row in cr:
        if firstline:  # skip first line
            firstline = False
            continue
        t = TransactionDbo.createFromCSV(row)
        DBManager.getSession().add(t)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return True


def import_bnp(filename):
    cr = csv.reader(open(filename, "rt"), delimiter=';')
    firstline = True
    for row in cr:
        if firstline:  # skip first line
            firstline = False
            continue
        t = TransactionDbo.createFromCSV2(row)
        DBManager.getSession().add(t)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return True


def import_ing(filename):
    cr = csv.reader(open(filename, "rt"), delimiter=';')
    a_name = filename.rsplit("_")[0].replace("uploads\\", "")
    account = AccountDbo.findFromName(a_name)
    for row in cr:
        t = TransactionDbo.createFromCSV3(row)
        t.account_id = account.id
        DBManager.getSession().add(t)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return True


def import_ing_lux(filename):
    cr = csv.reader(open(filename, "rt"), delimiter=';')
    a_name = filename.rsplit("_")[1]
    account = AccountDbo.findFromName(a_name)
    firstline = True
    for row in cr:
        if firstline:  # skip first line
            firstline = False
            continue
        t = TransactionDbo.createFromCSV4(row)
        t.account_id = account.id
        DBManager.getSession().add(t)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return True
