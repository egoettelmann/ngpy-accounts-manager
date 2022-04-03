import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/api.models';
import { RqlService } from '../rql.service';
import { FilterRequest, SearchRequest } from '../../models/rql.models';
import { flatMap, startWith, tap } from 'rxjs/operators';
import { EventBusService } from '../event-bus.service';

/**
 * The transactions rest service.
 */
@Injectable()
export class TransactionsRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param rqlService the RQL service
   * @param eventBusService the event bus service
   */
  constructor(private http: HttpClient,
              private rqlService: RqlService,
              private eventBusService: EventBusService
  ) {
  }

  /**
   * Gets a transaction by its id.
   *
   * @param transactionId the transaction id
   */
  getOne(transactionId: number): Observable<Transaction> {
    return this.eventBusService.accept(['transactions.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Transaction>('/rest/transactions/' + transactionId))
    );
  }

  /**
   * Gets all transactions matching a provided search request.
   *
   * @param searchRequest the search request
   */
  getAll(searchRequest: SearchRequest): Observable<Transaction[]> {
    const params = this.rqlService.buildHttpParams(searchRequest);
    return this.eventBusService.accept(['transactions.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Transaction[]>('/rest/transactions', { params }))
    );
  }

  /**
   * Counts all transactions matching a provided filter request.
   *
   * @param filterRequest the filter request
   */
  countAll(filterRequest: FilterRequest): Observable<number> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.eventBusService.accept(['transactions.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<number>('/rest/transactions/count', { params }))
    );
  }

  /**
   * Deletes a transaction by its id.
   *
   * @param transactionId the transaction id
   */
  deleteOne(transactionId: number): Observable<any> {
    return this.http.delete('/rest/transactions/' + transactionId).pipe(
      tap(() => this.eventBusService.publish('transactions.delete', transactionId))
    );
  }

  /**
   * Creates a transaction.
   *
   * @param transaction the transaction to create
   */
  createOne(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>('/rest/transactions', JSON.stringify(transaction)).pipe(
      tap(() => this.eventBusService.publish('transactions.create', transaction))
    );
  }

  /**
   * Updates a transaction with a patch.
   *
   * @param transactionId the transaction id
   * @param diff the patch to apply
   */
  updateOne(transactionId: number, diff: any): Observable<Transaction> {
    return this.http.post<Transaction>('/rest/transactions/' + transactionId, JSON.stringify(diff)).pipe(
      tap(() => this.eventBusService.publish('transactions.update', transactionId))
    );
  }

}
