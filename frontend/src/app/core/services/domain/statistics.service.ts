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

  getSummary(year?: number, month?: number, accounts?: number[], labelIds?: number[]): Observable<Summary> {
    return this.statisticsRestService.getSummary(year, month, accounts, labelIds);
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
