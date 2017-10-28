import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Account} from './account';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountsService {

  constructor(private http: HttpClient) {}

  getAccounts(): Promise<Account[]> {
    return this.http.get<Account[]>('/rest/accounts').toPromise();
  }

}
