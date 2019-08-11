import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { StatisticsRestService } from '../../../core/services/rest/statistics-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import * as _ from 'lodash';
import { Account, KeyValue, Label, Summary, Transaction } from '../../../core/models/api.models';
import { zip } from 'rxjs';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { TransactionsService } from '../../../core/services/domain/transactions.service';

@Component({
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss']
})
export class TreasuryComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public accountsFilter: number[] = [];
  public labelsFilter: number[];

  public accounts: Account[];
  public labels: Label[];
  public topTransactionsAsc: Transaction[];
  public topTransactionsDesc: Transaction[];
  public summary: Summary;
  public evolution: KeyValue[];
  public aggregationCredit: KeyValue[];
  public aggregationDebit: KeyValue[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private accountsService: AccountsRestService,
              private labelsService: LabelsRestService,
              private statisticsService: StatisticsRestService,
              private transactionsService: TransactionsService
  ) {
  }

  ngOnInit(): void {
    this.initData();
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ).subscribe(([accounts, labels]) => {
      this.accounts = accounts;
      this.labels = labels;
      this.reloadData();
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    const newFilter = accounts.length === this.accounts.length ? [] : accounts.map(a => a.id);
    if (!_.isEqual(this.accountsFilter, newFilter)) {
      this.accountsFilter = newFilter;
      this.reloadData();
    }
  }

  /**
   * Triggered on label change.
   *
   * @param {number[]} labels the new list of label ids
   */
  changeLabels(labels: number[]) {
    const newFilter = labels;
    if (!_.isEqual(this.labelsFilter, newFilter)) {
      this.labelsFilter = newFilter;
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
   * Initializes the component with the data from the route
   */
  private initData() {
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = CommonFunctions.getCurrentYear();
    } else {
      this.currentYear = +this.route.snapshot.paramMap.get('year');
    }
    if (!this.route.snapshot.queryParamMap.has('account')) {
      this.accountsFilter = [];
    } else {
      this.accountsFilter = this.route.snapshot.queryParamMap.get('account')
        .split(',')
        .map(a => +a);
    }
    if (!this.route.snapshot.queryParamMap.has('labels')) {
      this.labelsFilter = undefined;
    } else {
      this.labelsFilter = this.route.snapshot.queryParamMap.get('labels')
        .split(',')
        .map(a => +a);
    }
  }

  /**
   * Loads the data for the view
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    const labels = this.labelsFilter;
    this.loadSummary(this.currentYear, accounts);
    this.loadEvolution(this.currentYear, accounts);
    this.loadAggregation(this.currentYear, accounts, labels);
    this.loadTops(this.currentYear, accounts, labels);

    const url = this.router.createUrlTree(['treasury', this.currentYear], {
      queryParams: {
        'account': accounts ? accounts.join(',') : undefined,
        'labels': labels ? labels.join(',') : undefined
      }
    }).toString();
    this.location.go(url);
  }

  /**
   * Loads the evolution data.
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadEvolution(year: number, accounts: number[]) {
    this.statisticsService.getEvolution(year, accounts).subscribe(data => {
      this.evolution = data;
    });
  }

  /**
   * Loads the aggregation data.
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   * @param {number[]} labels the labels to filter on
   */
  private loadAggregation(year: number, accounts: number[], labels: number[]) {
    this.statisticsService.getAggregation(year, undefined, accounts, labels, true).subscribe(data => {
      this.aggregationCredit = data;
    });
    this.statisticsService.getAggregation(year, undefined, accounts, labels, false).subscribe(data => {
      this.aggregationDebit = data;
    });
  }

  /**
   * Loads the summary.
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadSummary(year: number, accounts: number[]) {
    this.statisticsService.getSummary(year, undefined, accounts).subscribe(data => {
      this.summary = data;
    });
  }

  /**
   * Loads the top transactions (highest credit and debit).
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   * @param {number[]} labels the labels to filter on
   */
  private loadTops(year: number, accounts: number[], labels: number[]) {
    this.transactionsService.getTopCredits(year, accounts, labels).subscribe(data => {
      this.topTransactionsDesc = data;
    });
    this.transactionsService.getTopDebits(year, accounts, labels).subscribe(data => {
      this.topTransactionsAsc = data;
    });
  }

}
