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

  getAggregation(year?: number, month?: number, accounts?: number[], labelIds?: number[], credit?: boolean): Observable<KeyValue[]> {
    let params = new HttpParams();

    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (month !== undefined) {
      params = params.append('month', month.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    if (labelIds !== undefined) {
      params = params.append('label_ids', labelIds.join(','));
    }
    if (credit !== undefined) {
      params = params.append('credit', ''+credit);
    }
    return this.http.get<any>('/rest/stats/aggregation', {params: params});
  }

  getSummary(year?: number, month?: number, accounts?: number[], labelIds?: number[]): Observable<Summary> {
    let params = new HttpParams();

    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (month !== undefined) {
      params = params.append('month', month.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    if (labelIds !== undefined) {
      params = params.append('label_ids', labelIds.join(','));
    }
    return this.http.get<any>('/rest/stats/summary', {params: params});
  }

  getEvolution(year: number, accounts?: number[]): Observable<KeyValue[]> {
    let params = new HttpParams();

    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<KeyValue[]>('/rest/stats/evolution', {params: params});
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
