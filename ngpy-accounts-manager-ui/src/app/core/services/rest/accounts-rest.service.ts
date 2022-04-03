import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';
import { SearchRequest } from '../../models/rql.models';
import { RqlService } from '../rql.service';
import { EventBusService } from '../event-bus.service';
import { flatMap, startWith, tap } from 'rxjs/operators';

/**
 * The accounts rest service.
 */
@Injectable()
export class AccountsRestService {

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
   * Finds all accounts matching a provided search request.
   *
   * @param searchRequest the search request
   */
  findAll(searchRequest?: SearchRequest): Observable<Account[]> {
    let params: HttpParams;
    if (searchRequest != null) {
      params = this.rqlService.buildHttpParams(searchRequest);
    }
    return this.eventBusService.accept(['accounts.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Account[]>('/rest/accounts', { params }))
    );
  }

  /**
   * Deletes an account by its id.
   *
   * @param accountId the id of the account to delete
   */
  deleteOne(accountId: number): Observable<void> {
    return this.http.delete<void>('/rest/accounts/' + accountId).pipe(
      tap(() => this.eventBusService.publish('accounts.delete', accountId))
    );
  }

  /**
   * Saves an account.
   *
   * @param account the account to save
   */
  saveOne(account: Account): Observable<Account> {
    return this.http.post<Account>('/rest/accounts', JSON.stringify(account)).pipe(
      tap(() => this.eventBusService.publish('accounts.update', account))
    );
  }

}
