import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Summary } from '../components/statistics/summary';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {
  }

  getGroupedByLabel(year: number, month: number, accounts: number[]): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (month !== undefined) {
      params = params.append('month', month.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/repartition', {params: params});
  }

  getSummary(year?: number, month?: number, accounts?: number[]): Observable<Summary> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (month !== undefined) {
      params = params.append('month', month.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/summary', {params: params});
  }

  getEvolution(year: number, accounts?: number[]): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/treasury', {params: params});
  }

  getAnalytics(year?: number, categoryType?: string, accounts?: number[]): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (categoryType !== undefined) {
      params = params.append('category_type', categoryType);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/analytics', {params: params});
  }

  getAnalyticsDetails(year?: number, categoryType?: string, accounts?: number[]): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
    }
    if (categoryType !== undefined) {
      params = params.append('category_type', categoryType);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/analytics/details', {params: params});
  }

}
