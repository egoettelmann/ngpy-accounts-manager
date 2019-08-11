import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterCriteria, PageRequest, Transaction } from '../../models/api.models';
import { CommonFunctions } from '../../../shared/utils/common-functions';

@Injectable()
export class TransactionsRestService {

  constructor(private http: HttpClient) {
  }

  getAll(filterCriteria?: FilterCriteria, pageRequest?: PageRequest): Observable<Transaction[]> {
    const params = CommonFunctions.buildHttpParams(filterCriteria, pageRequest);
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
