import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Account } from '../components/accounts/account';
import { Label } from '../components/transactions/label';

@Injectable()
export class AccountsService {

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
