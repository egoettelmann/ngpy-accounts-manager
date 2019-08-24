import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';
import { SearchRequest } from '../../models/rql.models';
import { RqlService } from '../rql.service';

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
   */
  constructor(private http: HttpClient,
              private rqlService: RqlService
  ) {
  }

  /**
   * Finds all accounts matching a provided search request.
   *
   * @param searchRequest the search request
   */
  findAll(searchRequest?: SearchRequest): Observable<Account[]> {
    let params;
    if (searchRequest != null) {
      params = this.rqlService.buildHttpParams(searchRequest);
    }
    return this.http.get<Account[]>('/rest/accounts', { params: params });
  }

  /**
   * Deletes an account by its id.
   *
   * @param accountId the id of the account to delete
   */
  deleteOne(accountId: number) {
    return this.http.delete('/rest/accounts/' + accountId);
  }

  /**
   * Saves an account.
   *
   * @param account the account to save
   */
  saveOne(account: Account) {
    return this.http.post('/rest/accounts', JSON.stringify(account));
  }

}
