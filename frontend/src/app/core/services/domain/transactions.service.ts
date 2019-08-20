import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/api.models';
import { TransactionsRestService } from '../rest/transactions-rest.service';
import { RqlService } from '../rql.service';
import { FilterOperator, FilterRequest, SearchRequest } from '../../models/rql.models';

/**
 * The transactions service
 */
@Injectable()
export class TransactionsService {

  /**
   * Instantiates the service.
   *
   * @param transactionRestService the transactions rest service
   * @param rqlService the RQL service
   */
  constructor(private transactionRestService: TransactionsRestService,
              private rqlService: RqlService
  ) {}

  /**
   * Searches transactions with a provided list of criteria.
   *
   * @param searchRequest the filter criteria
   */
  search(searchRequest: SearchRequest): Observable<Transaction[]> {
    return this.transactionRestService.getAll(searchRequest);
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
    const dateFrom = this.rqlService.formatDate(new Date(year, month - 1, 1));

    // Building the date to
    let dateTo: string;
    if (month === 12) {
      dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));
    } else {
      dateTo = this.rqlService.formatDate(new Date(year, month, 1));
    }

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.transactionRestService.getAll({
      filter: filter,
      sort: {
        sort: 'dateValue'
      }
    });
  }

  /**
   * Gets the top credit transactions for a provided year.
   *
   * @param year the year
   * @param accounts the accounts
   * @param labels the labels
   */
  getTopCredits(year: number, accounts: number[], labels: number[]): Observable<Transaction[]> {
    const dateFrom = this.rqlService.formatDate(new Date(year, 0, 1));
    const dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT),
      FilterRequest.of('amount', 0, FilterOperator.GE)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    // Adding the label filters
    if (labels && labels.length > 0) {
      const labelList = this.rqlService.formatList(labels);
      filter = FilterRequest.all(
        FilterRequest.of('labelId', labelList, FilterOperator.IN),
        filter
      );
    }

    return this.transactionRestService.getAll({
      filter: filter,
      page: {
        page: 1,
        pageSize: 10
      },
      sort: {
        sort: 'amount',
        sortDirection: 'DESC'
      }
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
    const dateFrom = this.rqlService.formatDate(new Date(year, 0, 1));
    const dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT),
      FilterRequest.of('amount', 0, FilterOperator.LT)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    // Adding the label filters
    if (labels && labels.length > 0) {
      const labelList = this.rqlService.formatList(labels);
      filter = FilterRequest.all(
        FilterRequest.of('labelId', labelList, FilterOperator.IN),
        filter
      );
    }

    return this.transactionRestService.getAll({
      filter: filter,
      page: {
        page: 1,
        pageSize: 10
      },
      sort: {
        sort: 'amount',
        sortDirection: 'ASC'
      }
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
