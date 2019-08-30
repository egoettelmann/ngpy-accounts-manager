import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '../../../../core/services/date.service';
import { BudgetService } from '../../../../core/services/domain/budget.service';
import { Account, BudgetStatus, Category } from '../../../../core/models/api.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import * as _ from 'lodash';
import { RouterService } from '../../../../core/services/router.service';

@Component({
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {

  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[] = [];

  public accounts: Account[];
  public categories: Category[];

  public budgetStatusList: BudgetStatus[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private routerService: RouterService,
              private dateService: DateService,
              private budgetService: BudgetService,
              private accountsService: AccountsService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.initData();
    this.accountsService.getAccounts().subscribe(accounts => {
      this.accounts = accounts.slice(0);
      this.reloadData();
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: number[]) {
    if (!_.isEqual(this.accountsFilter, accounts)) {
      this.accountsFilter = accounts.slice(0);
      this.reloadData();
    }
  }

  /**
   * Triggered on year change.
   *
   * @param year
   */
  changeYear(year: number) {
    this.currentYear = year;
    this.reloadData();
  }

  /**
   * Triggered on month change.
   *
   * @param month
   */
  changeMonth(month: number) {
    this.currentMonth = month;
    this.reloadData();
  }

  /**
   * Redirects to the details page of a given budget id.
   *
   * @param budgetId the budget id
   */
  goToDetails(budgetId: number) {
    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setMonth(this.currentMonth, params);
    this.router.navigate(['budget', budgetId], {
      queryParams: params
    });
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData() {
    this.currentYear = this.routerService.getYear(this.route);
    this.currentMonth = this.routerService.getMonth(this.route);
    this.accountsFilter = this.routerService.getAccounts(this.route);
  }

  /**
   * Reload the data
   */
  private reloadData() {
    this.budgetService.getStatusList(this.accountsFilter, this.currentYear, this.currentMonth).subscribe(data => {
      this.budgetStatusList = data;
    });

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setMonth(this.currentMonth, params);
    params = this.routerService.setAccounts(this.accountsFilter, params);
    this.routerService.refresh(['budget'], params);
  }

}
