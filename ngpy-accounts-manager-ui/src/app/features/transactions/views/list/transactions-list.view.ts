import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LabelsRestService } from '../../../../core/services/rest/labels-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { zip } from 'rxjs';
import * as _ from 'lodash';
import { Account, KeyValue, Label, Summary, Transaction } from '../../../../core/models/api.models';
import { TransactionsService } from '../../../../core/services/domain/transactions.service';
import { StatisticsService } from '../../../../core/services/domain/statistics.service';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import { DateService } from '../../../../core/services/date.service';
import { RouterService } from '../../../../core/services/router.service';

@Component({
  templateUrl: './transactions-list.view.html',
  styleUrls: ['./transactions-list.view.scss']
})
export class TransactionsListView implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[];

  public transactions: Transaction[];
  public graphOptions: any;
  public summary: Summary;
  public accounts: Account[];
  public labels: Label[];

  constructor(private route: ActivatedRoute,
              private routerService: RouterService,
              private labelsService: LabelsRestService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private dateService: DateService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    this.initData();
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ).subscribe(([accounts, labels]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
      this.reloadData();
    });
  }

  /**
   * Triggered on account change.
   *
   * @param accounts the new list of accounts
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
   * Triggerd on month change.
   *
   * @param month
   */
  changeMonth(month: number) {
    this.currentMonth = month;
    this.reloadData();
  }

  /**
   * Opens the modal with the transaction form.
   *
   * @param transaction
   */
  openModal(transaction: Transaction) {
    this.routerService.openTransactionForm(transaction.id);
  }

  /**
   * Opens the transaction form modal with a new transaction
   */
  addTransaction() {
    const newTransaction = new Transaction();
    this.openModal(newTransaction);
  }

  /**
   * Saves an existing or a new transaction.
   *
   * @param {Transaction} transaction the transaction to save
   */
  saveTransaction(transaction: Transaction) {
    this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
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
   * Loads the data for the view
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    zip(
      this.transactionsService.getAll(this.currentYear, this.currentMonth, accounts),
      this.statisticsService.getSummary(accounts, this.currentYear, this.currentMonth),
      this.statisticsService.getRepartition(this.currentYear, this.currentMonth, accounts)
    ).subscribe(([transactions, summary, repartition]) => {
      this.transactions = transactions.slice(0);
      this.summary = summary;
      this.graphOptions = this.buildChartOptions(repartition);
    });

    const params = this.buildQueryParams();
    this.routerService.refresh('route.transactions.list', {}, params);
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: KeyValue[]) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function() {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories: []
      },
      series: [{
        data: [],
        showInLegend: false
      }]
    };
    for (const d of data) {
      options.xAxis.categories.push(d.key);
      options.series[0].data.push(d.value);
    }
    return options;
  }

  /**
   * Builds the current query params
   */
  private buildQueryParams(): Params {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;

    let params = {};
    params = this.routerService.setYear(this.currentYear, params);
    params = this.routerService.setMonth(this.currentMonth, params);
    params = this.routerService.setAccounts(accounts, params);
    return params;
  }

}
