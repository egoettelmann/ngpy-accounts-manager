import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Transaction } from '../modules/transactions/transaction';

@Injectable()
export class TransactionsService {

  constructor(private http: HttpClient) {}

  getAll(year?: string, month?: string, accounts?: number[]): Observable<Transaction[]> {
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

    return this.http.get<Transaction[]>('/rest/transactions', {params: params});
  }

  getTop(numTransactions: number, ascending: boolean, year?: string, month?: string, accounts?: number[]): Observable<Transaction[]> {
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

    return this.http.get<Transaction[]>('/rest/transactions/top/' + numTransactions + '/' + ascending, {params: params});
  }

  deleteOne(transaction: Transaction): Observable<any> {
    return this.http.delete('/rest/transactions/' + transaction.id);
  }

  createOne(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transaction.id, JSON.stringify(transaction));
  }

  updateOne(transaction_id: number, diff: any): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transaction_id, JSON.stringify(diff));
  }

}
