import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../../../core/services/date.service';
import { BudgetService } from '../../../../core/services/domain/budget.service';
import { Account, Budget, BudgetStatus, Category, Label } from '../../../../core/models/api.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import * as _ from 'lodash';
import { RouterService } from '../../../../core/services/router.service';
import { combineLatest, Subscription } from 'rxjs';
import { LabelsService } from '../../../../core/services/domain/labels.service';

@Component({
  templateUrl: './budget-list.view.html',
  styleUrls: ['./budget-list.view.scss']
})
export class BudgetListView implements OnInit, OnDestroy {

  currentYear: number;
  currentMonth: number;
  accountsFilter: number[] = [];

  accounts: Account[];
  labels: Label[];
  categories: Category[];

  budgetStatusList: BudgetStatus[];

  newBudget: Budget;
  showModal = false;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private route: ActivatedRoute,
              private routerService: RouterService,
              private dateService: DateService,
              private budgetService: BudgetService,
              private labelsService: LabelsService,
              private accountsService: AccountsService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.initData();
    const sub = combineLatest([
      this.accountsService.getAccounts(),
      this.labelsService.getLabels()
    ]).subscribe(([accounts, labels]) => {
      this.accounts = accounts;
      this.labels = labels;
      this.reloadData();
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
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
    this.routerService.navigate('route.budgets.details', {
      budgetId: budgetId
    }, {
      queryParams: params
    });
  }

  /**
   * Opens the modal with the budget form.
   */
  openModal() {
    this.newBudget = {};
    this.showModal = true;
  }

  /**
   * Closes the modal with the budget form.
   */
  closeModal() {
    this.showModal = false;
    this.newBudget = undefined;
  }

  /**
   * Saves the budget.
   *
   * @param budget the budget to save
   */
  saveBudget(budget: Budget) {
    this.budgetService.saveOne(budget).subscribe(() => {
      this.closeModal();
      this.reloadData();
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
    const sub = this.budgetService.getStatusList(this.accountsFilter, this.currentYear, this.currentMonth).subscribe(data => {
      this.budgetStatusList = data;
    });
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = sub;

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setMonth(this.currentMonth, params);
    params = this.routerService.setAccounts(this.accountsFilter, params);
    this.routerService.refresh(this.route, params);
  }

}
