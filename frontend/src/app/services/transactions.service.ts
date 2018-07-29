import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Transaction } from '../components/transactions/transaction';

@Injectable()
export class TransactionsService {

  constructor(private http: HttpClient) {
  }

  getAll(
    year?: number,
    month?: number,
    accounts?: number[],
    labelIds?: number[],
    description?: string
  ): Observable<Transaction[]> {
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
    if (labelIds !== undefined) {
      params = params.append('label_ids', labelIds.join(','));
    }
    if (description != null) {
      params = params.append('description', description);
    }

    return this.http.get<Transaction[]>('/rest/transactions', {params: params});
  }

  getTop(numTransactions: number, ascending: boolean, year?: number, month?: string, accounts?: number[]): Observable<Transaction[]> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (year !== undefined) {
      params = params.append('year', year.toString());
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
