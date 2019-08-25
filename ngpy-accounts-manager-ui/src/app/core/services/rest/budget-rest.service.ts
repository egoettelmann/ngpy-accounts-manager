import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../../models/api.models';
import { RqlService } from '../rql.service';
import { FilterRequest } from '../../models/rql.models';
import { CommonFunctions } from '../../../shared/utils/common-functions';

/**
 * The budget rest service.
 */
@Injectable()
export class BudgetRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param rqlService the RQL service
   */
  constructor(private http: HttpClient,
              private rqlService: RqlService
  ) {}

  /**
   * Gets all transactions matching a provided filter request.
   *
   * @param filterRequest the filter request
   */
  searchAll(filterRequest: FilterRequest): Observable<Budget[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.http.get<Budget[]>('/rest/budgets', { params: params });
  }

  /**
   * Deletes a budget by its id.
   *
   * @param budgetId the budget id
   */
  deleteOne(budgetId: number): Observable<any> {
    return this.http.delete('/rest/budgets/' + budgetId);
  }

  /**
   * Saves a budget.
   *
   * @param budget the budget to save
   */
  saveOne(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>('/rest/budgets', CommonFunctions.removeEmpty(budget));
  }

}
