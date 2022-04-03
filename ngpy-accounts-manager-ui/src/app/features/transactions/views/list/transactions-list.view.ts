import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Account, KeyValue, Label, Summary, Transaction } from '@core/models/api.models';
import { TransactionsService } from '@core/services/domain/transactions.service';
import { StatisticsService } from '@core/services/domain/statistics.service';
import { AccountsService } from '@core/services/domain/accounts.service';
import { DateService } from '@core/services/date.service';
import { RouterService } from '@core/services/router.service';
import { LabelsService } from '@core/services/domain/labels.service';
import { ToLabelPipe } from '@shared/pipes/to-label.pipe';
import { Options, XrangePointOptionsObject } from 'highcharts';

@Component({
  templateUrl: './transactions-list.view.html',
  styleUrls: ['./transactions-list.view.scss']
})
export class TransactionsListView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear?: number;
  public currentMonth?: number;
  public accountsFilter: number[] = [];

  public transactions?: Transaction[];
  public graphOptions: any;
  public summary?: Summary;
  public accounts?: Account[];
  public labels?: Label[];

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private route: ActivatedRoute,
              private routerService: RouterService,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private dateService: DateService,
              private decimalPipe: DecimalPipe,
              private toLabelPipe: ToLabelPipe
  ) {
  }

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
   * @param accounts the new list of accounts
   */
  changeAccounts(accounts: number[]): void {
    if (!_.isEqual(this.accountsFilter, accounts)) {
      this.accountsFilter = accounts.slice(0);
      this.reloadData();
    }
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
   * Triggerd on month change.
   *
   * @param month the new month
   */
  changeMonth(month: number): void {
    this.currentMonth = month;
    this.reloadData();
  }

  /**
   * Opens the modal with the transaction form.
   *
   * @param transaction the transaction
   */
  openModal(transaction: Transaction): void {
    this.routerService.openTransactionForm(transaction.id);
  }

  /**
   * Opens the transaction form modal with a new transaction
   */
  addTransaction(): void {
    const newTransaction = {};
    this.openModal(newTransaction);
  }

  /**
   * Saves an existing or a new transaction.
   *
   * @param transaction the transaction to save
   */
  saveTransaction(transaction: Transaction): void {
    if (transaction.id == null) {
      return;
    }
    this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
      this.reloadData();
    });
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData(): void {
    this.currentYear = this.routerService.getYear(this.route);
    this.currentMonth = this.routerService.getMonth(this.route);
    this.accountsFilter = this.routerService.getAccounts(this.route);
  }

  /**
   * Loads the data for the view
   */
  private reloadData(): void {
    if (this.currentYear == null || this.currentMonth == null) {
      return;
    }
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    const sub = combineLatest([
      this.transactionsService.getAll(this.currentYear, this.currentMonth, accounts),
      this.statisticsService.getSummary(accounts, this.currentYear, this.currentMonth),
      this.statisticsService.getRepartition(this.currentYear, this.currentMonth, accounts)
    ]).subscribe(([transactions, summary, repartition]) => {
      this.transactions = transactions.slice(0);
      this.summary = summary;
      this.graphOptions = this.buildChartOptions(repartition);
    });
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = sub;

    const params = this.buildQueryParams();
    this.routerService.refresh(this.route, params);
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: KeyValue[]): Options {
    const that = this;
    const [categories, series] = this.buildChartSeries(data);
    return {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter(): string {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories
      },
      series: [{
        type: 'column',
        data: series,
        showInLegend: false
      }]
    };
  }

  private buildChartSeries(values: KeyValue[]): [string[], XrangePointOptionsObject[]] {
    const categories: string[] = [];
    const series: XrangePointOptionsObject[] = [];
    for (const d of values) {
      const label = this.toLabelPipe.transform(+d.key) as Label;
      const point = {
        y: d.value,
        color: label.color
      };
      categories.push(label.name);
      series.push(point);
    }
    return [categories, series];
  }

  /**
   * Builds the current query params
   */
  private buildQueryParams(): Params {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;

    let params = {};
    if (this.currentYear != null) {
      params = this.routerService.setYear(this.currentYear, params);
    }
    if (this.currentMonth != null) {
      params = this.routerService.setMonth(this.currentMonth, params);
    }
    params = this.routerService.setAccounts(accounts, params);
    return params;
  }

}
