import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../models/api.models';
import { AccountsRestService } from '../rest/accounts-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';

/**
 * The accounts service
 */
@Injectable()
export class AccountsService {

  /**
   * Instantiates the service.
   *
   * @param accountsRestService the accounts rest service
   */
  constructor(private accountsRestService: AccountsRestService) {
  }

  /**
   * Gets all accounts.
   */
  getAccounts(): Observable<Account[]> {
    return this.accountsRestService.findAll();
  }

  /**
   * Gets all active accounts.
   */
  getActiveAccounts(): Observable<Account[]> {
    const filter = FilterRequest.of('active', true, FilterOperator.EQ);
    return this.accountsRestService.findAll({
      filter
    });
  }

  /**
   * Deletes an account.
   *
   * @param account the account to delete
   */
  deleteOne(account: Account): Observable<void> {
    return this.accountsRestService.deleteOne(account.id);
  }

  /**
   * Saves an account.
   *
   * @param account the account to save
   */
  saveOne(account: Account): Observable<Account> {
    return this.accountsRestService.saveOne(account);
  }

}
