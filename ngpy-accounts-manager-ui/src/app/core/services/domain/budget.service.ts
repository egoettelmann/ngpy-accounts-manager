import { Injectable } from '@angular/core';
import { RqlService } from '../rql.service';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { Observable, zip } from 'rxjs';
import { Budget, CompositeKeyValue, Summary } from '../../models/api.models';
import { DateService } from '../date.service';
import { BudgetRestService } from '../rest/budget-rest.service';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { map } from 'rxjs/operators';
import { BudgetStatus } from '../../models/domain.models';
import { AccountsRestService } from '../rest/accounts-rest.service';

/**
 * The budget service
 */
@Injectable()
export class BudgetService {

  /**
   * Instantiates the service.
   *
   * @param statisticsRestService the statistics rest service
   * @param budgetRestService the budget rest service
   * @param accountsRestService the accounts rest service
   * @param dateService the date service
   * @param rqlService the RQL service
   */
  constructor(private statisticsRestService: StatisticsRestService,
              private budgetRestService: BudgetRestService,
              private accountsRestService: AccountsRestService,
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
  getMonthlyBudgetPerCategory(accounts: number[], year: number, month: number): Observable<BudgetStatus[]> {
    return zip(
      this.getBudgetsForCategoryType(accounts, 'D'),
      this.getMonthlyAnalyticsForCategoryType(accounts, year, month, 'D'),
      this.getSummary(accounts, year, month)
    ).pipe(
      map(([budgets, analytics, summary]) => {
        const total = summary.totalCredit;
        const budgetsMap: { [key: string]: BudgetStatus } = {};

        // Looping on all budget items
        budgets.forEach(budget => {
          budgetsMap[budget.category.name] = {
            label: budget.category.name,
            expected: Math.abs(budget.amount),
            expectedPercentage: 0,
            actual: 0,
            actualPercentage: 0
          };
        });

        // Looping on all analytics items
        analytics.forEach(item => {
          if (budgetsMap.hasOwnProperty(item.keyTwo)) {
            const budgetAmount = budgetsMap[item.keyTwo].expected;
            const spendingAmount = Math.abs(item.value);
            budgetsMap[item.keyTwo].actual = spendingAmount;
            budgetsMap[item.keyTwo].actualPercentage = spendingAmount / budgetAmount;
            if (spendingAmount > budgetAmount) {
              budgetsMap[item.keyTwo].expectedPercentage = 1;
            } else {
              budgetsMap[item.keyTwo].expectedPercentage = spendingAmount / budgetAmount;
            }
          }
        });

        return Object.values(budgetsMap);
      })
    );
  }

  private getBudgetsForCategoryType(accounts: number[], categoryType: string): Observable<Budget[]> {
    // Adding category type filter
    let filter = FilterRequest.all(
      FilterRequest.of('categoryId', null, FilterOperator.NE),
      FilterRequest.of('categoryType', categoryType, FilterOperator.EQ)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.budgetRestService.searchAll(filter);
  }

  private getMonthlyAnalyticsForCategoryType(
    accounts: number[], year: number, month: number, categoryType: string
  ): Observable<CompositeKeyValue[]> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year, month);
    const dateTo = this.dateService.getPeriodEnd(year, month);

    // Adding date and category type filters
    let filter = FilterRequest.all(
      FilterRequest.of('dateValue', this.dateService.format(dateFrom), FilterOperator.GE),
      FilterRequest.of('dateValue', this.dateService.format(dateTo), FilterOperator.LT),
      FilterRequest.of('categoryType', categoryType, FilterOperator.EQ)
    );

    // Adding the account filters
    if (accounts && accounts.length > 0) {
      const accountList = this.rqlService.formatList(accounts);
      filter = FilterRequest.all(
        FilterRequest.of('accountId', accountList, FilterOperator.IN),
        filter
      );
    }

    return this.statisticsRestService.getAnalytics('MONTH', filter);
  }

  private getSummary(accounts: number[], year: number, month: number): Observable<Summary> {
    // Building start and end date
    const dateFrom = this.dateService.getPeriodStart(year, month);
    const dateTo = this.dateService.getPeriodEnd(year, month);

    return this.statisticsRestService.getSummary(dateFrom, dateTo, accounts, undefined);
  }

}
