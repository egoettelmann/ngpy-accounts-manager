import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '../../../../core/services/date.service';
import { BudgetService } from '../../../../core/services/domain/budget.service';
import { Account, BudgetStatus, Category } from '../../../../core/models/api.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import * as _ from 'lodash';

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
              private location: Location,
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
   * Initializes the component with the data from the route
   */
  private initData() {
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = this.dateService.getCurrentYear();
    } else {
      this.currentYear = +this.route.snapshot.paramMap.get('year');
    }
    if (!this.route.snapshot.paramMap.has('month')) {
      this.currentMonth = this.dateService.getCurrentMonth();
    } else {
      this.currentMonth = +this.route.snapshot.paramMap.get('month');
    }
    if (!this.route.snapshot.queryParamMap.has('account')) {
      this.accountsFilter = [];
    } else {
      this.accountsFilter = this.route.snapshot.queryParamMap.get('account')
        .split(',')
        .map(a => +a);
    }
  }

  /**
   * Reload the data
   */
  private reloadData() {
    this.budgetService.getStatusList(this.accountsFilter, this.currentYear, this.currentMonth).subscribe(data => {
      this.budgetStatusList = data;
    });
  }

}
