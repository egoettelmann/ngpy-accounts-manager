import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Transaction } from './transaction';
import { Observable } from 'rxjs/Observable';
import { Operation } from 'fast-json-patch';

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

  deleteOne(transaction: Transaction): Observable<any> {
    return this.http.delete('/rest/transactions/' + transaction.id, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'json',
      withCredentials: true
    });
  }

  createOne(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transaction.id, JSON.stringify(transaction));
  }

  updateOne(transaction_id: number, diff: Operation[]): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transaction_id, JSON.stringify(diff));
  }

}
