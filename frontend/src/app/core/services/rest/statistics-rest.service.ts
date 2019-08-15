import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompositeKeyValue, KeyValue, Summary } from '../../models/api.models';
import { Observable } from 'rxjs';
import { RqlService } from '../rql.service';
import { FilterRequest } from '../../models/rql.models';

@Injectable()
export class StatisticsRestService {

  constructor(private http: HttpClient,
              private rqlService: RqlService
  ) {}

  getRepartition(filterRequest: FilterRequest): Observable<KeyValue[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.http.get<KeyValue[]>('/rest/stats/repartition', {params: params});
  }

  getEvolution(period: string, dateFrom: Date, dateTo: Date, accounts: number[], filterRequest: FilterRequest): Observable<KeyValue[]> {
    let params = new HttpParams();

    // Adding from date
    const startDate = this.rqlService.formatDate(dateFrom);
    const endDate = this.rqlService.formatDate(dateTo);
    params = params.set('date_from', startDate);
    params = params.set('date_to', endDate);

    // Adding period
    params = params.set('period', period);

    // Adding accounts
    if (accounts != null) {
      params = params.append('account_ids', accounts.join(','));
    }

    // Adding additional filters
    params = this.rqlService.buildHttpParamsFromFilter(filterRequest, params);

    return this.http.get<KeyValue[]>('/rest/stats/evolution', {params: params});
  }

  getAggregation(period: string, filterRequest: FilterRequest): Observable<KeyValue[]> {
    let params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    params = params.set('period', period);
    return this.http.get<any>('/rest/stats/aggregation', {params: params});
  }

  getSummary(dateFrom: Date, dateTo: Date, accounts: number[], filterRequest: FilterRequest): Observable<Summary> {
    let params = new HttpParams();

    // Adding from date
    const startDate = this.rqlService.formatDate(dateFrom);
    const endDate = this.rqlService.formatDate(dateTo);
    params = params.set('date_from', startDate);
    params = params.set('date_to', endDate);

    // Adding accounts
    if (accounts != null) {
      params = params.append('account_ids', accounts.join(','));
    }

    // Adding additional filters
    params = this.rqlService.buildHttpParamsFromFilter(filterRequest, params);

    return this.http.get<any>('/rest/stats/summary', {params: params});
  }

  getAnalytics(period: string, filterRequest: FilterRequest): Observable<CompositeKeyValue[]> {
    let params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    params = params.set('period', period);
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics', {params: params});
  }

  getAnalyticsDetails(filterRequest: FilterRequest): Observable<CompositeKeyValue[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics/details', {params: params});
  }

}
