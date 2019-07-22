import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';

@Injectable()
export class AccountsRestService {

  constructor(private http: HttpClient) {
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/rest/accounts');
  }

  deleteOne(account: Account) {
    return this.http.delete('/rest/accounts/' + account.id);
  }

  saveOne(account: Account) {
    return this.http.post('/rest/accounts', JSON.stringify(account));
  }

}