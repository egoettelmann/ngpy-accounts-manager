import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Account, KeyValue, Label, Summary, Transaction } from '../../../core/models/api.models';
import { zip } from 'rxjs';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { TransactionsService } from '../../../core/services/domain/transactions.service';
import { StatisticsService } from '../../../core/services/domain/statistics.service';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { RouterService } from '../../../core/services/router.service';

@Component({
  templateUrl: './treasury.view.html',
  styleUrls: ['./treasury.view.scss']
})
export class TreasuryView implements OnInit {

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
              private routerService: RouterService,
              private accountsService: AccountsService,
              private labelsService: LabelsRestService,
              private statisticsService: StatisticsService,
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
  changeAccounts(accounts: number[]) {
    if (!_.isEqual(this.accountsFilter, accounts)) {
      this.accountsFilter = accounts.slice(0);
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
      this.labelsFilter = newFilter ? newFilter.slice(0) : [];
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
    this.currentYear = this.routerService.getYear(this.route);
    this.accountsFilter = this.routerService.getAccounts(this.route);
    this.labelsFilter = this.routerService.getLabels(this.route);
  }

  /**
   * Loads the data for the view
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    const labels = this.labelsFilter.length > 0 ? this.labelsFilter : undefined;
    this.loadSummary(this.currentYear, accounts);
    this.loadEvolution(this.currentYear, accounts);
    this.loadAggregation(this.currentYear, accounts, labels);
    this.loadTops(this.currentYear, accounts, labels);

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setAccounts(accounts, params);
    params = this.routerService.setLabels(labels, params);
    this.routerService.refresh('route.treasury', {}, params);
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
    this.statisticsService.getAggregation(year, accounts, labels, true).subscribe(data => {
      this.aggregationCredit = data;
    });
    this.statisticsService.getAggregation(year, accounts, labels, false).subscribe(data => {
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
    this.statisticsService.getSummary(accounts, year).subscribe(data => {
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
