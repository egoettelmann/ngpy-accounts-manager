import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompositeKeyValue, KeyValue, Summary } from '../../models/api.models';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsRestService {

  constructor(private http: HttpClient) {
  }

  getRepartition(year: number, month: number, accounts: number[]): Observable<KeyValue[]> {
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
    return this.http.get<KeyValue[]>('/rest/stats/repartition', {params: params});
  }

  getAggregation(year?: number, month?: number, accounts?: number[], labelIds?: number[]): Observable<KeyValue[]> {
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

  getAnalytics(year?: number, categoryType?: string, accounts?: number[], quarterly = true): Observable<CompositeKeyValue[]> {
    let params = new HttpParams();

    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (categoryType !== undefined) {
      params = params.append('category_type', categoryType);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    params = params.append('quarterly', ''+quarterly);
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics', {params: params});
  }

  getAnalyticsDetails(year?: number, categoryType?: string, accounts?: number[]): Observable<CompositeKeyValue[]> {
    let params = new HttpParams();

    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (categoryType !== undefined) {
      params = params.append('category_type', categoryType);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics/details', {params: params});
  }

}
