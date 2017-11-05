import datetime
import json

from flask import request, make_response, redirect, g

import models.Helpers
from models.DBManager import DBManager
from models.entities.AccountDbo import AccountDbo
from models.entities.LabelDbo import LabelDbo
from models.entities.StatusDbo import Status
from models.entities.TransactionDbo import TransactionDbo


def labels_as_json():
    s = "["
    first = True
    for l in LabelDbo.query.all():
        if first:
            first = False
        else:
            s = s + ","
        s = s + '{"name": "' + l.name + '", "color": "' + l.color + '"}'
    s = s + "]"
    return s


def transactions_as_json():
    s = "["
    first = True
    for t in TransactionDbo.query.all():
        if first:
            first = False
        else:
            s = s + ","
        s = s + '{"reference": "' + t.reference + '", "date": "' + t.date_value.strftime(
            "%Y-%m-%d") + '", "amount": "' + "{0:.2f}".format(t.amount) + '"}'
    s = s + "]"
    return s


def status_as_json():
    s = "["
    first = True
    for status in Status.query.all():
        if first:
            first = False
        else:
            s = s + ","
        s = s + '{"date": "' + status.date.strftime("%Y-%m-%d") + '", "amount": "' + "{0:.2f}".format(
            status.value) + '"}'
    s = s + "]"
    return s


def attach_label():
    transaction_id = request.form['trans_id']
    label_name = request.form['value']
    label = LabelDbo.findFromName(label_name)
    trans = TransactionDbo.query.get(transaction_id)
    if trans:
        trans.label = label
        try:
            DBManager.getSession().commit()
        except:
            DBManager.getSession().rollback()
            raise
    return "Label successfully attached"


def detach_label():
    transaction_id = request.form['trans_id']
    trans = TransactionDbo.query.get(transaction_id)
    if trans:
        trans.label = []
        try:
            DBManager.getSession().commit()
        except:
            DBManager.getSession().rollback()
            raise
    return "Label successfully detached"


def delete_label(id):
    label = LabelDbo.query.get(id)
    DBManager.getSession().delete(label)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return redirect(request.referrer)


def update_label():
    label_id = int(request.form['label_id'])
    label_name = request.form['label_name']
    label_color = request.form['label_color']
    label_icon = request.form['label_icon']
    label = LabelDbo.query.get(label_id)
    if label:
        label.name = label_name
        label.color = label_color
        label.icon = label_icon
        try:
            DBManager.getSession().commit()
        except:
            DBManager.getSession().rollback()
            raise
    return redirect(request.referrer)


def create_account():
    account_name = request.form['account_name']
    account_description = request.form['account_description']
    account_color = request.form['account_color']
    status_value = float(request.form["status_value"])
    status_date = datetime.datetime.strptime(request.form["status_date"], "%d-%m-%Y").date()
    account = AccountDbo(account_name, account_description)
    account.color = account_color
    DBManager.getSession().add(account)
    try:
        DBManager.getSession().flush()
        status = Status(account.id, status_date, status_value)
        DBManager.getSession().add(status)
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return redirect(request.referrer)


def delete_account(id):
    account = AccountDbo.query.get(id)
    DBManager.getSession().delete(account)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return redirect(request.referrer)


def update_account():
    account_id = int(request.form['account_id'])
    account_name = request.form['account_name']
    account_description = request.form['account_description']
    account_color = request.form['account_color']
    account = AccountDbo.query.get(account_id)
    if account:
        account.name = account_name
        account.description = account_description
        account.color = account_color
        try:
            DBManager.getSession().commit()
        except:
            DBManager.getSession().rollback()
            raise
    return redirect(request.referrer)


def add_transaction():
    label_name = request.form["label_name"]
    label = LabelDbo.findFromName(label_name)
    account_id = int(request.form["account_id"])
    account = AccountDbo.query.get(account_id)
    date_compta = datetime.datetime.strptime(request.form["date_compta"], "%d-%m-%Y").date()
    date_operation = datetime.datetime.strptime(request.form["date_operation"], "%d-%m-%Y").date()
    description = request.form["description"]
    reference = request.form["reference"]
    date_value = datetime.datetime.strptime(request.form["date_value"], "%d-%m-%Y").date()
    amount = float(request.form["amount"])
    if account and label:
        transaction = TransactionDbo(account.id, date_compta, date_operation, description, reference, date_value, amount,
                                  "", label.id)
        DBManager.getSession().add(transaction)
        try:
            DBManager.getSession().commit()
        except:
            DBManager.getSession().rollback()
            raise
    return redirect(request.referrer)


def delete_transaction(id):
    transaction = TransactionDbo.query.get(id)
    DBManager.getSession().delete(transaction)
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return redirect(request.referrer)


def add_all_current_account():
    accounts = AccountDbo.query.all()
    resp = make_response(redirect(request.referrer))
    for account in accounts:
        if account.id not in g.current_accounts:
            g.current_accounts.append(account.id)
    resp.set_cookie('current_accounts', json.dumps(g.current_accounts))
    return resp


def add_current_account(account_id):
    account = AccountDbo.query.get(account_id)
    resp = make_response(redirect(request.referrer))
    if account:
        if account.id not in g.current_accounts:
            g.current_accounts.append(account.id)
            resp.set_cookie('current_accounts', json.dumps(g.current_accounts))
    return resp


def remove_current_account(account_id):
    account = AccountDbo.query.get(account_id)
    resp = make_response(redirect(request.referrer))
    if account:
        if (account.id in g.current_accounts) and len(g.current_accounts) > 1:
            g.current_accounts.remove(account.id)
            resp.set_cookie('current_accounts', json.dumps(g.current_accounts))
    return resp


def save_status():
    date = datetime.datetime.strptime(request.form['date'], "%Y-%m-%d").date()
    value = request.form['value']
    status = Status.query.filter(Status.date == date).first()
    if not status:
        status = Status(date)
        DBManager.getSession().add(status)
    status.value = value
    try:
        DBManager.getSession().commit()
    except:
        DBManager.getSession().rollback()
        raise
    return redirect(request.referrer)


def upload_csv():
    file = request.files['file']
    saved_file = models.Helpers.save_file(file, 'uploads')
    if saved_file:
        services.Importer.resolve_importer(saved_file)
        return 'File has been uploaded and parsed'
