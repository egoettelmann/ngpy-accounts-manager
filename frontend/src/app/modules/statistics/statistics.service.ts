import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {}

  getGroupedByLabel(year: string, month: string): Promise<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    if (month !== undefined) {
      params = params.append('month', month);
    }
    return this.http.get<any>('/rest/stats/repartition', {params: params}).toPromise();
  }

  getSummary(year: string, month: string): Promise<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    if (month !== undefined) {
      params = params.append('month', month);
    }
    return this.http.get<any>('/rest/stats/summary', {params: params}).toPromise();
  }

  getEvolution(year: string): Promise<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    return this.http.get<any>('/rest/stats/treasury', {params: params}).toPromise();
  }

}