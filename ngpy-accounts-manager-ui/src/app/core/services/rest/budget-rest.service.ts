import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, BudgetStatus } from '../../models/api.models';
import { RqlService } from '../rql.service';
import { FilterRequest } from '../../models/rql.models';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import { DateService } from '../date.service';
import { flatMap, startWith, tap } from 'rxjs/operators';
import { EventBusService } from '../event-bus.service';

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
   * @param dateService the date service
   * @param eventBusService the event bus service
   */
  constructor(private http: HttpClient,
              private rqlService: RqlService,
              private dateService: DateService,
              private eventBusService: EventBusService
  ) {
  }

  /**
   * Gets all transactions matching a provided filter request.
   *
   * @param filterRequest the filter request
   */
  searchAll(filterRequest: FilterRequest): Observable<Budget[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.eventBusService.accept(['budgets.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Budget[]>('/rest/budgets', { params: params }))
    );
  }

  /**
   * Gets a budgets by its id.
   *
   * @param budgetId the budget id
   */
  getOne(budgetId: number): Observable<Budget> {
    return this.eventBusService.accept(['budgets.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Budget>('/rest/budgets/' + budgetId))
    );
  }

  /**
   * Deletes a budget by its id.
   *
   * @param budgetId the budget id
   */
  deleteOne(budgetId: number): Observable<any> {
    return this.http.delete('/rest/budgets/' + budgetId).pipe(
      tap(() => this.eventBusService.publish('budgets.delete', budgetId))
    );
  }

  /**
   * Saves a budget.
   *
   * @param budget the budget to save
   */
  saveOne(budget: Budget): Observable<Budget> {
    return this.http.put<Budget>('/rest/budgets', CommonFunctions.removeEmpty(budget)).pipe(
      tap(() => this.eventBusService.publish('budgets.update', budget))
    );
  }

  /**
   * Gets the status list.
   *
   * @param date the optional status date param
   * @param filterRequest the optional filter request
   */
  getStatusList(date?: Date, filterRequest?: FilterRequest): Observable<BudgetStatus[]> {
    let params = this.rqlService.buildHttpParamsFromFilter(filterRequest);

    if (date != null) {
      const statusDate = this.dateService.format(date);
      params = params.set('date', statusDate);
    }

    return this.eventBusService.accept(['budgets.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<BudgetStatus[]>('/rest/budgets/status', { params: params }))
    );
  }

}
