import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';
import { SearchRequest } from '../../models/rql.models';
import { RqlService } from '../rql.service';

@Injectable()
export class AccountsRestService {

  constructor(private http: HttpClient,
              private rqlService: RqlService
  ) {
  }

  findAll(searchRequest?: SearchRequest): Observable<Account[]> {
    let params;
    if (searchRequest != null) {
      params = this.rqlService.buildHttpParams(searchRequest);
    }
    return this.http.get<Account[]>('/rest/accounts', { params: params });
  }

  deleteOne(accountId: number) {
    return this.http.delete('/rest/accounts/' + accountId);
  }

  saveOne(account: Account) {
    return this.http.post('/rest/accounts', JSON.stringify(account));
  }

}
