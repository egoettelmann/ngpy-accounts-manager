import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../../core/services/domain/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, Budget, BudgetStatus, KeyValue, Label, Transaction } from '../../../../core/models/api.models';
import { RouterService } from '../../../../core/services/router.service';
import { DateService } from '../../../../core/services/date.service';
import { zip } from 'rxjs';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import { LabelsRestService } from '../../../../core/services/rest/labels-rest.service';

@Component({
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss']
})
export class BudgetDetailsComponent implements OnInit {

  public currentYear: number;
  public currentMonth: number;

  private budgetId: number;

  budget: Budget;
  statusList: BudgetStatus[];
  transactions: Transaction[];

  accounts: Account[];
  labels: Label[];

  showModal = false;

  /**
   * Instantiates the component.
   *
   * @param route the activated route
   * @param router the router
   * @param routerService the router service
   * @param budgetService the budget service
   * @param accountsService the accounts service
   * @param labelsService the labels service
   * @param dateService the date service
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private routerService: RouterService,
              private budgetService: BudgetService,
              private accountsService: AccountsService,
              private labelsService: LabelsRestService,
              private dateService: DateService
  ) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.budgetId = +this.route.snapshot.paramMap.get('budgetId');
    this.initData();
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll(),
      this.budgetService.getDetails(this.budgetId)
    ).subscribe(([accounts, labels, details]) => {
      this.accounts = accounts;
      this.labels = labels;
      this.budget = details;
      this.reloadData();
    });
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
   * Checks if the month can be selected.
   */
  isMonthSelectable(): boolean {
    return this.budget.period === 'DAY';
  }

  /**
   * Opens the modal with the budget form.
   */
  openModal() {
    this.showModal = true;
  }

  /**
   * Closes the modal with the budget form.
   */
  closeModal() {
    this.showModal = false;
  }

  /**
   * Saves the budget.
   *
   * @param budget the budget to save
   */
  saveBudget(budget: Budget) {
    console.log('save', budget);
  }

  /**
   * Deletes the budget.
   *
   * @param budget the budget to delete
   */
  deleteBudget(budget: Budget) {
    console.log('delete', budget);
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData() {
    this.currentYear = this.routerService.getYear(this.route);
    this.currentMonth = this.routerService.getMonth(this.route);
  }

  /**
   * Reload the data from the backend and updates the route params
   */
  private reloadData() {
    const accountIds = this.budget.accounts.map(a => a.id);
    const labelIds = this.budget.labels.map(l => l.id);

    const dateFrom = this.buildStartDate();
    const dateTo = this.buildEndDate();

    zip(
      this.budgetService.getTransactions(dateFrom, dateTo, accountIds, labelIds),
      this.budgetService.getStatusHistory(dateFrom, dateTo, this.budget.period, accountIds, labelIds)
    ).subscribe(([transactions, data]) => {
      this.transactions = transactions;
      this.buildBudgetStatusList(data);
    });

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    if (this.isMonthSelectable()) {
      params = this.routerService.setMonth(this.currentMonth, params);
    }
    this.routerService.refresh(['budget', this.budgetId], params);
  }

  /**
   * Builds the start date
   */
  private buildStartDate(): Date {
    if (this.budget.period === 'DAY') {
      return this.dateService.getPeriodStart(this.currentYear, this.currentMonth);
    }
    if (this.budget.period === 'MONTH' || this.budget.period === 'QUARTER') {
      return this.dateService.getPeriodStart(this.currentYear);
    }
    return this.dateService.getPeriodStart(this.currentYear - 5);
  }

  /**
   * Builds the end date
   */
  private buildEndDate(): Date {
    if (this.budget.period === 'DAY') {
      return this.dateService.getPeriodEnd(this.currentYear, this.currentMonth);
    }
    if (this.budget.period === 'MONTH' || this.budget.period === 'QUARTER') {
      return this.dateService.getPeriodEnd(this.currentYear);
    }
    return this.dateService.getPeriodEnd(this.currentYear);
  }

  /**
   * Builds the budget status list.
   *
   * @param data the list of key/values
   */
  private buildBudgetStatusList(data: KeyValue[]) {
    const statusList: BudgetStatus[] = [];
    data.forEach(item => {
      const budget = JSON.parse(JSON.stringify(this.budget)) as Budget;
      budget.name = item.key;
      statusList.push({
        budget: budget,
        spending: item.value
      });
    });
    this.statusList = statusList;
  }

}
