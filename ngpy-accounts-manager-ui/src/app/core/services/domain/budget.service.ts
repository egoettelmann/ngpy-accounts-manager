import { Injectable } from '@angular/core';
import { RqlService } from '../rql.service';
import { Observable } from 'rxjs';
import { Budget, BudgetStatus, KeyValue, Transaction } from '../../models/api.models';
import { DateService } from '../date.service';
import { BudgetRestService } from '../rest/budget-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { TransactionsRestService } from '../rest/transactions-rest.service';

/**
 * The budget service
 */
@Injectable()
export class BudgetService {

  /**
   * Instantiates the service.
   *
   * @param budgetRestService the budget rest service
   * @param statisticsRestService the statistics rest service
   * @param transactionsRestService the transactions rest service
   * @param dateService the date service
   * @param rqlService the RQL service
   */
  constructor(private budgetRestService: BudgetRestService,
              private statisticsRestService: StatisticsRestService,
              private transactionsRestService: TransactionsRestService,
              private dateService: DateService,
              private rqlService: RqlService
  ) {
  }

  /**
   * Gets the details of a budget by its id.
   *
   * @param budgetId the budget id
   */
  getDetails(budgetId: number): Observable<Budget> {
    return this.budgetRestService.getOne(budgetId);
  }

  /**
   * Gets the status list for a given list of accounts, a year and a month.
   *
   * @param accounts the list of accounts
   * @param year the year
   * @param month the month
   */
  getStatusList(accounts: number[], year: number, month: number): Observable<BudgetStatus[]> {
    let filters: FilterRequest;
    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filters = FilterRequest.of('accountId', accountList, FilterOperator.IN);
    }

    const statusDate = this.dateService.getPeriodStart(year, month);
    return this.budgetRestService.getStatusList(statusDate, filters);
  }

  /**
   * Gets the status history.
   *
   * @param dateFrom
   * @param dateTo
   * @param period
   * @param accounts
   * @param labels
   */
  getStatusHistory(
    dateFrom: Date,
    dateTo: Date,
    period: string,
    accounts: number[],
    labels: number[]
  ): Observable<KeyValue[]> {
    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT)
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
      const accountList = this.rqlService.formatList(labels);
      filter = FilterRequest.all(
        FilterRequest.of('labelId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.statisticsRestService.getAggregation(period, filter);
  }

  /**
   * Gets the list of transactions.
   *
   * @param dateFrom
   * @param dateTo
   * @param accounts
   * @param labels
   */
  getTransactions(
    dateFrom: Date,
    dateTo: Date,
    accounts: number[],
    labels: number[]
  ): Observable<Transaction[]> {

    let filters = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT)
    );
    if (accounts && accounts.length > 0) {
      filters = FilterRequest.all(
        FilterRequest.of('accountId', this.rqlService.formatList(accounts), FilterOperator.IN),
        filters
      );
    }
    if (labels && labels.length > 0) {
      filters = FilterRequest.all(
        FilterRequest.of('labelId', this.rqlService.formatList(labels), FilterOperator.IN),
        filters
      );
    }

    return this.transactionsRestService.getAll({ filter: filters });
  }

}
