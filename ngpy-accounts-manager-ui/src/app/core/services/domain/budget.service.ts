import { Injectable } from '@angular/core';
import { RqlService } from '../rql.service';
import { Observable } from 'rxjs';
import { BudgetStatus } from '../../models/api.models';
import { DateService } from '../date.service';
import { BudgetRestService } from '../rest/budget-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';

/**
 * The budget service
 */
@Injectable()
export class BudgetService {

  /**
   * Instantiates the service.
   *
   * @param budgetRestService the budget rest service
   * @param dateService the date service
   * @param rqlService the RQL service
   */
  constructor(private budgetRestService: BudgetRestService,
              private dateService: DateService,
              private rqlService: RqlService
  ) {
  }

  /**
   * Gets the summary of a given list of accounts for a given period (year on month).
   *
   * @param accounts the list of accounts
   * @param year the year
   * @param month the month
   */
  getStatusList(accounts: number[], year: number, month: number): Observable<BudgetStatus[]> {
    let filters: FilterRequest;
    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filters = FilterRequest.of('accountId', accountList, FilterOperator.IN);
    }

    const statusDate = this.dateService.getPeriodStart(year, month);
    return this.budgetRestService.getStatusList(statusDate, filters);
  }

}
