import { Injectable } from '@angular/core';
import { RqlService } from '../rql.service';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { Observable } from 'rxjs';
import { CompositeKeyValue, KeyValue, Summary } from '../../models/api.models';

@Injectable()
export class StatisticsService {

  constructor(private statisticsRestService: StatisticsRestService,
              private rqlService: RqlService
  ) {}

  getSummary(accounts: number[], year: number, month?: number): Observable<Summary> {
    // Building start and end date
    if (month == null) {
      month = 0;
    }
    const dateFrom = new Date(year, month, 1);
    let dateTo: Date;
    if (month == 11) {
      dateTo = new Date(year + 1, 0, 1);
    } else {
      dateTo = new Date(year, month + 1, 1);
    }

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

  getAggregation(year: number, accounts: number[], labels: number[], credit: boolean): Observable<KeyValue[]> {
    // Building start and end date
    const dateFrom = this.rqlService.formatDate(new Date(year, 0, 1));
    const dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT),
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

    return this.statisticsRestService.getAggregation('MONTH', filter)
  }

  getEvolution(year: number, accounts: number[],): Observable<KeyValue[]> {
    const dateFrom = new Date(year, 0, 1);
    const dateTo = new Date(year + 1, 0, 1);

    return this.statisticsRestService.getEvolution('MONTH', dateFrom, dateTo, accounts, undefined);
  }

  getRepartition(year: number, month: number, accounts: number[]): Observable<KeyValue[]> {
    // Building start and end date
    const dateFrom = this.rqlService.formatDate(new Date(year, month, 1));
    let dateTo: string;
    if (month == 11) {
      dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));
    } else {
      dateTo = this.rqlService.formatDate(new Date(year, month + 1, 1));
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

    return this.statisticsRestService.getRepartition(filter);
  }

  getAnalytics(year: number, period: string, categoryType: string, accounts: number[]): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.rqlService.formatDate(new Date(year, 0, 1));
    const dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT),
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

    return this.statisticsRestService.getAnalytics(period, filter);
  }

  getAnalyticsDetails(year: number, categoryType: string, accounts: number[]): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.rqlService.formatDate(new Date(year, 0, 1));
    const dateTo = this.rqlService.formatDate(new Date(year + 1, 0, 1));

    // Adding date and amount filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', dateFrom, FilterOperator.GE),
      FilterRequest.of('dateValue', dateTo, FilterOperator.LT),
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

    return this.statisticsRestService.getAnalyticsDetails(filter);
  }

}
