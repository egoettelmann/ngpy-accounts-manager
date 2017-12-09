import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Account} from './account';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountsService {

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/rest/accounts');
  }

}
