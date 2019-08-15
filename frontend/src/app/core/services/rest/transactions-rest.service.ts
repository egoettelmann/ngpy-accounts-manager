import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/api.models';
import { RqlService } from '../rql.service';
import { SearchRequest } from '../../models/rql.models';

@Injectable()
export class TransactionsRestService {

  constructor(private http: HttpClient,
              private rqlService: RqlService
  ) {}

  getAll(searchRequest: SearchRequest): Observable<Transaction[]> {
    const params = this.rqlService.buildHttpParams(searchRequest);
    return this.http.get<Transaction[]>('/rest/transactions', { params: params });
  }

  deleteOne(transactionId: number): Observable<any> {
    return this.http.delete('/rest/transactions/' + transactionId);
  }

  createOne(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>('/rest/transactions', JSON.stringify(transaction));
  }

  updateOne(transactionId: number, diff: any): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transactionId, JSON.stringify(diff));
  }

}
