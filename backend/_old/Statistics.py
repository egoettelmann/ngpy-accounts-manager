import datetime

from sqlalchemy import func, extract, desc

from models.DBManager import DBManager
from models.entities.AccountDbo import AccountDbo
from models.entities.LabelDbo import LabelDbo
from models.entities.StatusDbo import Status
from models.entities.TransactionDbo import TransactionDbo


def filter_transactions_by_accounts(query, account_ids):
    if account_ids:
        ids = []
        for account_id in account_ids:
            a = AccountDbo.query.get(account_id)
            if a:
                ids.append(a.id)
        query = query.filter(TransactionDbo.account_id.in_(ids))
    return query


def filter_transactions_by_year(query, year):
    if year:
        query = query.filter(
            extract('year', TransactionDbo.date_value) == year
        )
    return query


def filter_transactions_by_month(query, month):
    if month:
        query = query.filter(
            extract('month', TransactionDbo.date_value) == month
        )
    return query


def filter_transactions_by_labels(query, labels=[]):
    if labels:
        ids = []
        for label in labels:
            l = LabelDbo.query.filter(LabelDbo.name == label).first()
            if l:
                ids.append(l.id)
        query = query.filter(TransactionDbo.label_id.in_(ids))
    return query


def get_total_by_labels(account_ids, year=None, month=None, labels=[]):
    result = []
    if not labels:
        labels = LabelDbo.query.all()
    for label in labels:
        entries = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
        entries = filter_transactions_by_accounts(entries, account_ids)
        entries = filter_transactions_by_year(entries, year)
        entries = filter_transactions_by_month(entries, month)
        entries = filter_transactions_by_labels(entries, [label.name])
        total = entries.scalar()
        if total is not None:
            result.append({
                "name": label.name,
                "total": total
            })
    return result


def get_last_status(account_id, date=None):
    status = Status.query.filter(Status.account_id == account_id)
    status = status.order_by(desc(Status.date))
    if date is not None:
        status = status.filter(Status.date < date)
    return status.first()


def get_account_status(account_id, year=None, month=None, day=None):
    if year is None:
        year = int(datetime.datetime.now().strftime("%Y"))
    if month is None:
        month = int(datetime.datetime.now().strftime("%m"))
    if day is None:
        day = int(datetime.datetime.now().strftime("%d"))
    end_date = datetime.date(year, month, day)

    status = get_last_status(account_id, end_date)
    if status:
        begin_amount = status.value
        begin_date = status.date
    else:
        begin_amount = 0
        begin_date = datetime.date(1900, 1, 1)

    query = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
    query = query.filter(TransactionDbo.account_id == account_id)
    query = query.filter(TransactionDbo.date_value >= begin_date)
    query = query.filter(TransactionDbo.date_value < end_date)
    total = query.scalar()
    if total is None:
        total = 0
    return begin_amount + total


def get_transactions(account_ids, year=None, month=None, labels=[]):
    entries = TransactionDbo.query
    entries = filter_transactions_by_accounts(entries, account_ids)
    entries = filter_transactions_by_year(entries, year)
    entries = filter_transactions_by_month(entries, month)
    entries = filter_transactions_by_labels(entries, labels)
    entries = entries.order_by(TransactionDbo.date_value)
    return entries


def get_transactions_by_search(search_string, account_ids, labels=[], begin_date=None, end_date=None, value_min=None,
                               value_max=None):
    entries = TransactionDbo.query
    entries = filter_transactions_by_accounts(entries, account_ids)
    entries = filter_transactions_by_labels(entries, labels)
    if begin_date:
        entries = entries.filter(TransactionDbo.date_value >= begin_date)
    if end_date:
        entries = entries.filter(TransactionDbo.date_value <= end_date)
    if value_min is not None:
        entries = entries.filter(TransactionDbo.amount >= value_min)
    if value_max is not None:
        entries = entries.filter(TransactionDbo.amount <= value_max)
    entries = entries.filter(TransactionDbo.description.like("%" + search_string + "%"))
    return entries


def get_transactions_total(account_ids, year=None, month=None, labels=[]):
    entries = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
    entries = filter_transactions_by_accounts(entries, account_ids)
    entries = filter_transactions_by_year(entries, year)
    entries = filter_transactions_by_month(entries, month)
    entries = filter_transactions_by_labels(entries, labels)
    return entries.scalar()


def get_transactions_total_debit(account_ids, year=None, month=None, labels=[]):
    entries = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
    entries = filter_transactions_by_accounts(entries, account_ids)
    entries = filter_transactions_by_year(entries, year)
    entries = filter_transactions_by_month(entries, month)
    entries = filter_transactions_by_labels(entries, labels)
    entries = entries.filter(
        TransactionDbo.amount < 0
    )
    return entries.scalar()


def get_transactions_total_credit(account_ids, year=None, month=None, labels=[]):
    entries = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
    entries = filter_transactions_by_accounts(entries, account_ids)
    entries = filter_transactions_by_year(entries, year)
    entries = filter_transactions_by_month(entries, month)
    entries = filter_transactions_by_labels(entries, labels)
    entries = entries.filter(
        TransactionDbo.amount > 0
    )
    return entries.scalar()


def get_results_of_transactions(transactions):
    debit = 0
    credit = 0
    for transaction in transactions:
        if transaction.amount >= 0:
            credit = credit + transaction.amount
        else:
            debit = debit + transaction.amount
    return (debit, credit)


def get_results(account_ids, year=None):
    entries1 = DBManager.getSession().query(TransactionDbo.date_value, func.sum(TransactionDbo.amount).label("total"))
    entries1 = filter_transactions_by_accounts(entries1, account_ids)
    entries1 = entries1.group_by(extract('month', TransactionDbo.date_value))
    if year is not None:
        entries1 = entries1.filter(extract('year', TransactionDbo.date_value) == year)
    entries1 = entries1.filter(TransactionDbo.amount < 0)

    entries2 = DBManager.getSession().query(TransactionDbo.date_value, func.sum(TransactionDbo.amount).label("total"))
    entries2 = filter_transactions_by_accounts(entries2, account_ids)
    entries2 = entries2.group_by(extract('month', TransactionDbo.date_value))
    if year is not None:
        entries2 = entries2.filter(extract('year', TransactionDbo.date_value) == year)
    entries2 = entries2.filter(TransactionDbo.amount >= 0)
    return (entries1, entries2)


def get_result(account_ids, year=None):
    entries1 = DBManager.getSession().query(TransactionDbo.date_value, func.sum(TransactionDbo.amount).label("total"))
    entries1 = filter_transactions_by_accounts(entries1, account_ids)
    entries1 = entries1.group_by(extract('month', TransactionDbo.date_value))
    if year is not None:
        entries1 = entries1.filter(extract('year', TransactionDbo.date_value) == year)
    return entries1


def get_repartition(account_ids, year=None, month=None):
    entries1 = DBManager.getSession().query(TransactionDbo.label_id, LabelDbo.name, TransactionDbo.date_value,
                                            func.sum(TransactionDbo.amount).label("total"),
                                            func.count(TransactionDbo.label_id).label("quantity"))
    entries1 = filter_transactions_by_accounts(entries1, account_ids)
    entries1 = entries1.join(LabelDbo, TransactionDbo.label_id == LabelDbo.id)
    entries1 = entries1.group_by(TransactionDbo.label_id)
    entries1 = entries1.order_by(TransactionDbo.label_id)
    if year is not None:
        entries1 = entries1.filter(extract('year', TransactionDbo.date_value) == year)
    if month is not None:
        entries1 = entries1.filter(extract('month', TransactionDbo.date_value) == month)
    entries1 = entries1.filter(TransactionDbo.amount < 0)

    entries2 = DBManager.getSession().query(TransactionDbo.label_id, LabelDbo.name, TransactionDbo.date_value,
                                            func.sum(TransactionDbo.amount).label("total"),
                                            func.count(TransactionDbo.label_id).label("quantity"))
    entries2 = filter_transactions_by_accounts(entries2, account_ids)
    entries2 = entries2.join(LabelDbo, TransactionDbo.label_id == LabelDbo.id)
    entries2 = entries2.group_by(TransactionDbo.label_id)
    entries2 = entries2.order_by(TransactionDbo.label_id)
    if year is not None:
        entries2 = entries2.filter(extract('year', TransactionDbo.date_value) == year)
    if month is not None:
        entries1 = entries2.filter(extract('month', TransactionDbo.date_value) == month)
    entries2 = entries2.filter(TransactionDbo.amount >= 0)
    return (entries1, entries2)


def get_account_repartition(account_ids, year=None, month=None, day=None):
    status = []
    for account_id in account_ids:
        a = AccountDbo.query.get(account_id)
        if a:
            s = get_account_status(a.id, year, month, day)
            status.append({
                'account': a,
                'status': s
            })
    return status
