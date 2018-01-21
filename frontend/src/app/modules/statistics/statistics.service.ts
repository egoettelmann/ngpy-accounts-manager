import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Summary } from './summary';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {}

  getGroupedByLabel(year: string, month: string, accounts: number[]): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    if (month !== undefined) {
      params = params.append('month', month);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/repartition', {params: params});
  }

  getSummary(year?: string, month?: string, accounts?: number[]): Observable<Summary> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    if (month !== undefined) {
      params = params.append('month', month);
    }
    if (accounts !== undefined) {
      params = params.append('account_ids', accounts.join(','));
    }
    return this.http.get<any>('/rest/stats/summary', {params: params});
  }

  getEvolution(year: string): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    return this.http.get<any>('/rest/stats/treasury', {params: params});
  }

}
