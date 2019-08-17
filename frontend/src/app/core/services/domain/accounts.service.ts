import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';
import { AccountsRestService } from '../rest/accounts-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';

@Injectable()
export class AccountsService {

  constructor(private accountsRestService: AccountsRestService) {
  }

  getAccounts(): Observable<Account[]> {
    return this.accountsRestService.findAll();
  }

  getActiveAccounts(): Observable<Account[]> {
    const filter = FilterRequest.of('active', true, FilterOperator.EQ);
    return this.accountsRestService.findAll({
      filter: filter
    });
  }

  deleteOne(account: Account) {
    return this.accountsRestService.deleteOne(account.id);
  }

  saveOne(account: Account) {
    return this.accountsRestService.saveOne(account);
  }

}
