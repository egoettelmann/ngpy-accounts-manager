import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterCriteria, Transaction } from '../../models/api.models';
import { TransactionsRestService } from '../rest/transactions-rest.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TransactionsService {

  constructor(private transactionRestService: TransactionsRestService) {
  }

  /**
   * Searches transactions with a provided list of criteria.
   *
   * @param filterCriteria the filter criteria
   */
  search(filterCriteria: FilterCriteria): Observable<Transaction[]> {
    return this.transactionRestService.getAll(filterCriteria);
  }

  /**
   * Gets all transactions for a given year, month, and a list of accounts.
   * If no month is given, will get all values for the provided year.
   * If no year given, will get all values.
   *
   * @param year the year
   * @param month the month
   * @param accounts the accounts
   */
  getAll(
    year: number,
    month: number,
    accounts: number[]
  ): Observable<Transaction[]> {
    // Building the date from
    const dateFrom = new Date(year, month - 1, 1);

    // Building the date to
    let dateTo: Date;
    if (month === 12) {
      dateTo = new Date(year + 1, 0, 1);
    } else {
      dateTo = new Date(year, month, 1);
    }

    return this.transactionRestService.getAll({
      accountIds: accounts,
      dateFrom: dateFrom,
      dateTo: dateTo
    }, {
      sort: 'date_value'
    });
  }

  /**
   * Counts the number of unlabeled transactions.
   */
  countUnlabeled(): Observable<number> {
    return this.transactionRestService.getAll({
      labelIds: [null]
    }).pipe(
      map(data => data.length)
    );
  }

  /**
   * Gets the top credit transactions for a provided year.
   *
   * @param year the year
   * @param accounts the accounts
   * @param labels the labels
   */
  getTopCredits(year: number, accounts: number[], labels: number[]): Observable<Transaction[]> {
    return this.transactionRestService.getAll({
      accountIds: accounts,
      labelIds: labels,
      dateFrom: new Date(year, 0, 1),
      dateTo: new Date(year + 1, 0, 1),
      min: 0
    }, {
      page: 1,
      pageSize: 10,
      sort: 'amount',
      sortDirection: 'DESC'
    });
  }

  /**
   * Gets the top debit transactions for a provided year.
   *
   * @param year the year
   * @param accounts the accounts
   * @param labels the labels
   */
  getTopDebits(year: number, accounts: number[], labels: number[]): Observable<Transaction[]> {
    return this.transactionRestService.getAll({
      accountIds: accounts,
      labelIds: labels,
      dateFrom: new Date(year, 0, 1),
      dateTo: new Date(year + 1, 0, 1),
      max: 0
    }, {
      page: 1,
      pageSize: 10,
      sort: 'amount',
      sortDirection: 'ASC'
    });
  }

  /**
   * Deletes a transaction.
   *
   * @param transaction the transaction to delete
   */
  deleteOne(transaction: Transaction): Observable<any> {
    return this.transactionRestService.deleteOne(transaction.id);
  }

  /**
   * Creates a new transaction.
   *
   * @param transaction the transaction to create
   */
  createOne(transaction: Transaction): Observable<Transaction> {
    return this.transactionRestService.createOne(transaction);
  }

  /**
   * Updates a transaction with a diff/patch.
   *
   * @param transactionId the transaction id to update
   * @param diff the diff/patch to apply
   */
  updateOne(transactionId: number, diff: any): Observable<Transaction> {
    return this.transactionRestService.updateOne(transactionId, diff);
  }

}
