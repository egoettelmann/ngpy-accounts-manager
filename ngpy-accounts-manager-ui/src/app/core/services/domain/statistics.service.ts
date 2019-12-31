import { Injectable } from '@angular/core';
import { RqlService } from '../rql.service';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { Observable } from 'rxjs';
import { CompositeKeyValue, KeyValue, Summary } from '../../models/api.models';
import { DateService } from '../date.service';
import { subMonths, subYears } from 'date-fns';

/**
 * The statistics service
 */
@Injectable()
export class StatisticsService {

  /**
   * Instantiates the service.
   *
   * @param statisticsRestService the statistics rest service
   * @param dateService the date service
   * @param rqlService the RQL service
   */
  constructor(private statisticsRestService: StatisticsRestService,
              private dateService: DateService,
              private rqlService: RqlService
  ) {}

  /**
   * Gets the summary of a given list of accounts for a given period (year on month).
   *
   * @param accounts the list of accounts
   * @param year the year
   * @param month the optional month
   */
  getSummary(accounts: number[], year: number, month?: number): Observable<Summary> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year, month);
    const dateTo = this.dateService.getPeriodEnd(year, month);

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

  /**
   * Gets the summary of the rolling month for a given list of accounts.
   *
   * @param accounts the list of accounts
   */
  getRollingMonthSummary(accounts: number[]): Observable<Summary> {
    const dateTo = new Date();
    const dateFrom = subMonths(dateTo, 1);

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

  /**
   * Gets the summary of the rolling month for a given list of accounts.
   *
   * @param accounts the list of accounts
   */
  getRollingThreeMonthsSummary(accounts: number[]): Observable<Summary> {
    const dateTo = new Date();
    const dateFrom = subMonths(dateTo, 3);

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

  /**
   * Gets the summary of the rolling year for a given list of accounts.
   *
   * @param accounts the list of accounts
   */
  getRollingYearSummary(accounts: number[]): Observable<Summary> {
    const dateTo = new Date();
    const dateFrom = subYears(dateTo, 1);

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

  /**
   * Gets the aggregation by labels of a given list of accounts.
   *
   * @param year the year
   * @param accounts the list of accounts
   * @param labels the labels to filter
   * @param credit filter credit transactions if true, filters debit transactions if false
   */
  getAggregation(year: number, accounts: number[], labels: number[], credit: boolean): Observable<KeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year);
    const dateTo = this.dateService.getPeriodEnd(year);

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT),
      FilterRequest.of('amount', 0, credit ? FilterOperator.GE : FilterOperator.LT)
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

    return this.statisticsRestService.getAggregation('MONTH', filter);
  }

  /**
   * Gets the evolution for a given list of accounts.
   *
   * @param year the year of the evolution
   * @param accounts the list of accounts
   */
  getEvolution(year: number, accounts: number[]): Observable<KeyValue[]> {
    const dateFrom = this.dateService.getPeriodStart(year);
    const dateTo = this.dateService.getPeriodEnd(year);

    return this.statisticsRestService.getEvolution('MONTH', dateFrom, dateTo, accounts, undefined);
  }

  /**
   * Gets the repartition for a given list of accounts.
   *
   * @param year the year
   * @param month the month
   * @param accounts the list of accounts
   */
  getRepartition(year: number, month: number, accounts: number[]): Observable<KeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year, month);
    const dateTo = this.dateService.getPeriodEnd(year, month);

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

    return this.statisticsRestService.getRepartition(filter);
  }

  /**
   * Gets the analytics by category for a given list of accounts.
   *
   * @param year the year
   * @param period the aggregation period
   * @param categoryType the category type to filter on
   * @param accounts the list of accounts
   */
  getAnalyticsByCategory(year: number, period: string, categoryType: string, accounts: number[]): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year);
    const dateTo = this.dateService.getPeriodEnd(year);

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT),
      FilterRequest.of('categoryType', categoryType, FilterOperator.EQ)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.statisticsRestService.getAnalyticsByCategory(period, filter);
  }

  /**
   * Gets the analytics by label for a given list of accounts.
   *
   * @param year the year
   * @param period the aggregation period
   * @param categoryId the category id to filter on
   * @param accounts the list of accounts
   */
  getAnalyticsByLabel(year: number, period: string, categoryId: number, accounts: number[]): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year);
    const dateTo = this.dateService.getPeriodEnd(year);

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT),
      FilterRequest.of('categoryId', categoryId, FilterOperator.EQ)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.statisticsRestService.getAnalyticsByLabel(period, filter);
  }

  /**
   * Gets the analytics details for a given list of accounts.
   *
   * @param year the year
   * @param categoryType the category type to filter
   * @param accounts the list of accounts
   */
  getAnalyticsRepartition(year: number, categoryType: string, accounts: number[]): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year);
    const dateTo = this.dateService.getPeriodEnd(year);

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT),
      FilterRequest.of('categoryType', categoryType, FilterOperator.EQ)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.statisticsRestService.getAnalyticsRepartition(filter);
  }

}
