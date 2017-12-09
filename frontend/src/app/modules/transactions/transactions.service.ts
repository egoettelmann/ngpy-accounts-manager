import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Transaction} from './transaction';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TransactionsService {

  constructor(private http: HttpClient) {}

  getAll(year?: string, month?: string): Observable<Transaction[]> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year);
    }
    if (month !== undefined) {
      params = params.append('month', month);
    }

    return this.http.get<Transaction[]>('/rest/transactions', {params: params});
  }

}
