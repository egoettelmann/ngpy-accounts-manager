import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Account, KeyValue, Label, Summary, Transaction } from '../../../core/models/api.models';
import { combineLatest, Subscription } from 'rxjs';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { TransactionsService } from '../../../core/services/domain/transactions.service';
import { StatisticsService } from '../../../core/services/domain/statistics.service';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { RouterService } from '../../../core/services/router.service';

@Component({
  templateUrl: './treasury.view.html',
  styleUrls: ['./treasury.view.scss']
})
export class TreasuryView implements OnInit, OnDestroy {

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

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

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
    const sub = combineLatest([
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
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
    const sub = combineLatest([
      this.statisticsService.getSummary(accounts, this.currentYear),
      this.statisticsService.getEvolution(this.currentYear, accounts),
      this.statisticsService.getAggregation(this.currentYear, accounts, labels, true),
      this.statisticsService.getAggregation(this.currentYear, accounts, labels, false),
      this.transactionsService.getTopCredits(this.currentYear, accounts, labels),
      this.transactionsService.getTopDebits(this.currentYear, accounts, labels)
    ]).subscribe(([summary, evolution, aggregationCredit, aggregationDebit, credits, debits]) => {
      this.summary = summary;
      this.evolution = evolution;
      this.aggregationCredit = aggregationCredit;
      this.aggregationDebit = aggregationDebit;
      this.topTransactionsDesc = credits;
      this.topTransactionsAsc = debits;
    });
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = sub;

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setAccounts(accounts, params);
    params = this.routerService.setLabels(labels, params);
    this.routerService.refresh('route.treasury', {}, params);
  }

}
