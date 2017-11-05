import datetime

import models.Helpers
from models.DBManager import DBManager
from models.entities.AccountDbo import AccountDbo
from models.entities.StatusDbo import Status
from models.entities.TransactionDbo import TransactionDbo


def init():
    DBManager.getBase().metadata.create_all(bind=DBManager.getEngine())
    date = datetime.date(2010, 12, 31)
    status1 = Status(1, date, 1703.37)  # initial status
    status2 = Status(2, date, 77.66)  # initial status
    DBManager.getSession().add(status1)
    DBManager.getSession().add(status2)
    models.Helpers.import_csv2("compta_courant.csv")
    models.Helpers.import_csv2("compta_livreta.csv")
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return "Database successfully created"


def sql():
    acc1 = AccountDbo.query.get(1)
    acc2 = AccountDbo.query.get(2)
    acc1.description = "Compte courant"
    acc2.description = "Comptes épargnes"
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return "Queries successfully executed"


def sql_old():
    acc1 = AccountDbo.query.get(1)
    acc2 = AccountDbo.query.get(3)
    # acc1.name = acc2.name
    # acc2.name = "tmp_error"
    transactions = TransactionDbo.query.filter(TransactionDbo.account_id == acc2.id)
    for transaction in transactions:
        transaction.account_id = acc1.id
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return "Queries successfully executed"
