import calendar
import datetime
import hashlib

from flask import render_template, request, g
from sqlalchemy import asc

import services.Statistics
from models.entities.LabelDbo import LabelDbo
from models.entities.StatusDbo import Status


def index(year, month, labels):
    total = services.Statistics.get_transactions_total(g.current_accounts, year, month, labels)
    if total is None:
        total = 0

    total_debit = services.Statistics.get_transactions_total_debit(g.current_accounts, year, month, labels)
    if total_debit is None:
        total_debit = 0

    total_credit = services.Statistics.get_transactions_total_credit(g.current_accounts, year, month, labels)
    if total_credit is None:
        total_credit = 0

    entries = services.Statistics.get_transactions(g.current_accounts, year, month, labels)
    for e in entries:
        r = str(e.date_compta) + e.description + str(e.amount)
        ref = hashlib.md5(r.encode('utf-8')).hexdigest().upper()
        reference = ''.join([x for idx, x in enumerate(ref) if idx in [1, 3, 5, 7, 9, 11, 13]])
    account_status = 0
    for acc_s in g.current_accounts:
        account_status = account_status + services.Statistics.get_account_status(acc_s, year, month, 1)
    grouped_sum = services.Statistics.get_total_by_labels(g.current_accounts, year, month)
    last_status = services.Statistics.get_last_status(g.current_accounts[0])

    return render_template('index.html', title="Mouvements de " + calendar.month_name[month] + " " + str(year),
                           entries=entries,
                           today=datetime.date.today(),
                           total=total,
                           total_debit=total_debit,
                           total_credit=total_credit,
                           current_account_status=account_status,
                           current_year=year,
                           current_month=month,
                           last_day_of_month=calendar.monthrange(year, month)[1],
                           last_status=last_status,
                           grouped_sum=grouped_sum,
                           filtered_labels=labels
                           )


def history_result(year, month):
    total = services.Statistics.get_transactions_total(g.current_accounts, year, month)
    (debit, credit) = services.Statistics.get_results(g.current_accounts, year)
    (repartition_debit, repartition_credit) = services.Statistics.get_repartition(g.current_accounts, year, month)

    return render_template('history.html', title="Historique de " + str(year),
                           debit=debit,
                           credit=credit,
                           repartition_debit=repartition_debit,
                           repartition_credit=repartition_credit,
                           total=total,
                           current_year=year
                           )


def history_account(year, month):
    total = services.Statistics.get_transactions_total(g.current_accounts, year)
    begin_account_status = 0
    for acc_s in g.current_accounts:
        begin_account_status = begin_account_status + services.Statistics.get_account_status(acc_s, year, month, 1)
    result = services.Statistics.get_result(g.current_accounts, year)
    repartition_status = services.Statistics.get_account_repartition(g.current_accounts, year + 1, 1, 1)

    return render_template('account.html', title="Historique de " + str(year),
                           result=result,
                           begin_account_status=begin_account_status,
                           total=total,
                           current_year=year,
                           repartition_status=repartition_status
                           )


def search_transactions():
    results = None
    debit = None
    credit = None
    search_string = ""
    title = "Recherche avancée"
    begin_date = ""
    end_date = ""
    value_min = ""
    value_max = ""
    labels = []

    if request.method == 'POST':
        search_string = request.form['s']
        if request.form['date_min'] != '':
            begin_date = datetime.datetime.strptime(request.form["date_min"], "%Y-%m-%d").date()
        else:
            begin_date = None

        if request.form['date_max'] != '':
            end_date = datetime.datetime.strptime(request.form["date_max"], "%Y-%m-%d").date()
        else:
            end_date = None

        value_min = request.form.get('value_min', '')
        if value_min != '':
            value_min = float(value_min)
            print("Value min: " + str(value_min))
        else:
            value_min = None

        value_max = request.form.get('value_max', '')
        if value_max != '':
            value_max = float(value_max)
            print("Value max: " + str(value_max))
        else:
            value_max = None

        labels = request.form.getlist('labels')

        results = services.Statistics.get_transactions_by_search(search_string, g.current_accounts, labels, begin_date,
                                                                 end_date, value_min, value_max)
        (debit, credit) = services.Statistics.get_results_of_transactions(results)
        title = "Recherche de \"" + search_string + "\""

    return render_template('search.html', title=title,
                           search_string=search_string,
                           results=results,
                           debit=debit,
                           credit=credit,
                           begin_date=begin_date,
                           end_date=end_date,
                           value_min=value_min,
                           value_max=value_max,
                           labels=labels,
                           filtered_labels=[],
                           current_year=datetime.date.today().year
                           )


def labels():
    labels = LabelDbo.query.order_by(LabelDbo.name)

    return render_template('labels.html', title="Liste des labels",
                           labels=labels,
                           filtered_labels=[],
                           current_year=datetime.date.today().year
                           )


def accounts():
    status = Status.query.order_by(asc(Status.date)).group_by(Status.account_id)

    return render_template('accounts.html', title="Liste des comptes",
                           status=status,
                           filtered_labels=[],
                           current_year=datetime.date.today().year
                           )


def add_transaction():
    return render_template('transaction.html', title="Ajouter une transaction",
                           filtered_labels=[],
                           current_year=datetime.date.today().year
                           )
