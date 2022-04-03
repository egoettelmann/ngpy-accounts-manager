import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '@core/services/domain/budget.service';
import { ActivatedRoute } from '@angular/router';
import { Account, Budget, BudgetStatus, KeyValue, Label, Transaction } from '@core/models/api.models';
import { RouterService } from '@core/services/router.service';
import { DateService } from '@core/services/date.service';
import { combineLatest, Subscription } from 'rxjs';
import { AccountsService } from '@core/services/domain/accounts.service';
import { LabelsService } from '@core/services/domain/labels.service';

@Component({
  templateUrl: './budget-details.view.html',
  styleUrls: ['./budget-details.view.scss']
})
export class BudgetDetailsView implements OnInit, OnDestroy {

  currentYear?: number;
  currentMonth?: number;

  budget?: Budget;
  statusList?: BudgetStatus[];
  transactions?: Transaction[];
  accounts?: Account[];
  labels?: Label[];

  showModal = false;

  private budgetId?: number;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  /**
   * Instantiates the component.
   *
   * @param route the activated route
   * @param routerService the router service
   * @param budgetService the budget service
   * @param accountsService the accounts service
   * @param labelsService the labels service
   * @param dateService the date service
   */
  constructor(private route: ActivatedRoute,
              private routerService: RouterService,
              private budgetService: BudgetService,
              private accountsService: AccountsService,
              private labelsService: LabelsService,
              private dateService: DateService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('budgetId');
    if (param != null) {
      this.budgetId = +param;
    }
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

  /**
   * Triggered once the component is destroyed
   */
  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  /**
   * Triggered on year change.
   *
   * @param year the new year
   */
  changeYear(year: number): void {
    this.currentYear = year;
    this.reloadData();
  }

  /**
   * Triggered on month change.
   *
   * @param month the new month
   */
  changeMonth(month: number): void {
    this.currentMonth = month;
    this.reloadData();
  }

  /**
   * Checks if the month can be selected.
   */
  isMonthSelectable(): boolean {
    return this.budget != null && this.budget.period === 'DAY';
  }

  /**
   * Opens the modal with the budget form.
   */
  openModal(): void {
    this.showModal = true;
  }

  /**
   * Closes the modal with the budget form.
   */
  closeModal(): void {
    this.showModal = false;
  }

  /**
   * Saves the budget.
   *
   * @param budget the budget to save
   */
  saveBudget(budget: Budget): void {
    this.budgetService.saveOne(budget).subscribe(() => {
      this.closeModal();
      this.reloadData();
    });
  }

  /**
   * Deletes the budget.
   *
   * @param budget the budget to delete
   */
  deleteBudget(budget: Budget): void {
    this.budgetService.deleteOne(budget).subscribe(() => {
      this.closeModal();
      this.reloadData();
    });
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData(): void {
    this.currentYear = this.routerService.getYear(this.route);
    this.currentMonth = this.routerService.getMonth(this.route);
  }

  /**
   * Reload the data from the backend and updates the route params
   */
  private reloadData(): void {
    if (this.budgetId == null) {
      return;
    }
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = new Subscription();

    const sub = this.budgetService.getDetails(this.budgetId).subscribe(budget => {
      this.budget = budget;
      if (this.budget == null || this.budget.period == null) {
        return;
      }

      const accountIds = this.budget.accounts?.map(a => a.id);
      const labelIds = this.budget.labels?.map(l => l.id);

      const dateFrom = this.buildStartDate();
      const dateTo = this.buildEndDate();

      const subDetails = combineLatest([
        this.budgetService.getTransactions(dateFrom, dateTo, accountIds, labelIds),
        this.budgetService.getStatusHistory(dateFrom, dateTo, this.budget.period, accountIds, labelIds)
      ]).subscribe(([transactions, statusHistory]) => {
        this.transactions = transactions;
        this.buildBudgetStatusList(statusHistory);
      });
      this.subscriptions.active.add(subDetails);

      if (this.currentYear == null) {
        return;
      }
      let params = {};
      params = this.routerService.setYear(this.currentYear, params);
      if (this.isMonthSelectable() && this.currentMonth != null) {
        params = this.routerService.setMonth(this.currentMonth, params);
      }
      this.routerService.refresh(this.route, params);
    });
    this.subscriptions.active.add(sub);
  }

  /**
   * Builds the start date
   */
  private buildStartDate(): Date {
    let startDateYear = this.currentYear;
    if (startDateYear == null) {
      startDateYear = this.dateService.getCurrentYear();
    }
    if (this.budget && this.budget.period === 'DAY') {
      return this.dateService.getPeriodStart(startDateYear, this.currentMonth);
    }
    if (this.budget && (this.budget.period === 'MONTH' || this.budget.period === 'QUARTER')) {
      return this.dateService.getPeriodStart(startDateYear);
    }
    return this.dateService.getPeriodStart(startDateYear - 5);
  }

  /**
   * Builds the end date
   */
  private buildEndDate(): Date {
    let endDateYear = this.currentYear;
    if (endDateYear == null) {
      endDateYear = this.dateService.getCurrentYear();
    }
    if (this.budget && this.budget.period === 'DAY') {
      return this.dateService.getPeriodEnd(endDateYear, this.currentMonth);
    }
    if (this.budget && (this.budget.period === 'MONTH' || this.budget.period === 'QUARTER')) {
      return this.dateService.getPeriodEnd(endDateYear);
    }
    return this.dateService.getPeriodEnd(endDateYear);
  }

  /**
   * Builds the budget status list.
   *
   * @param data the list of key/values
   */
  private buildBudgetStatusList(data: KeyValue[]): void {
    const statusList: BudgetStatus[] = [];
    data.forEach(item => {
      const budget = JSON.parse(JSON.stringify(this.budget)) as Budget;
      budget.name = item.key;
      statusList.push({
        budget,
        spending: item.value
      });
    });
    this.statusList = statusList;
  }

}
