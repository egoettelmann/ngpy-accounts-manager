import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LabelsService } from '../../../services/labels.service';
import { TransactionsService } from '../../../services/transactions.service';
import { StatisticsService } from '../../../services/statistics.service';
import { AccountsService } from '../../../services/accounts.service';
import { PatchEvent, Transaction } from '../../../components/transactions/transaction';
import { Summary } from '../../../components/statistics/summary';
import { Label } from '../../../components/transactions/label';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { zip } from 'rxjs/observable/zip';
import { CommonFunctions } from '../../../common/common-functions';

@Component({
  templateUrl: './transactions-view.component.html'
})
export class TransactionsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public monthList = CommonFunctions.getMonthsList();
  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[];

  public transactions: Transaction[];
  public graphOptions: any;
  public summary: Summary;
  public accounts: Account[] = [];
  public labels: Label[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    if (!this.route.snapshot.paramMap.has('year') || !this.route.snapshot.paramMap.has('month')) {
      if (!this.route.snapshot.paramMap.has('year')) {
        this.currentYear = CommonFunctions.getCurrentYear();
      }
      if (!this.route.snapshot.paramMap.has('month')) {
        this.currentMonth = CommonFunctions.getCurrentMonth();
      }
      this.changeAccounts([]);
      return;
    }
    this.initOnChanges();
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ).subscribe(([accounts, labels]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    this.accountsFilter = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.router.navigate(['transactions', this.currentYear, this.currentMonth], {
      queryParams: {
        account: this.accountsFilter ? this.accountsFilter.join(',') : undefined
      }
    });
  }

  /**
   * FIXME: implement the backend call and review the input param
   */
  saveTransaction(patchEvent: PatchEvent<Transaction>) {
    this.transactionsService.updateOne(patchEvent.model.id, patchEvent.changes).subscribe(data => {
      this.loadData();
    });
  }

  /***
   * Deletes a given transaction.
   * FIXME: add delete button to table
   *
   * @param {Transaction} transaction the transaction to delete
   */
  deleteTransaction(transaction: Transaction) {
    this.transactionsService.deleteOne(transaction).subscribe(data => {
      this.loadData();
    });
  }

  /**
   * Listens on any route change to reload the data
   */
  private initOnChanges() {
    combineLatest(
      this.route.paramMap.pipe(startWith(undefined)),
      this.route.queryParamMap.pipe(startWith(undefined))
    ).pipe(
      debounceTime(20)
    ).subscribe(([paramMap, queryParamMap]) => {
      let reload = false;
      // Checking if any param has changed
      if (paramMap) {
        this.currentYear = +paramMap.get('year');
        this.currentMonth = +paramMap.get('month');
        reload = true;
      }
      // Checking if any query param has changed
      this.accountsFilter = undefined;
      if (queryParamMap && queryParamMap.has('account')) {
        this.accountsFilter = queryParamMap.get('account')
          .split(',')
          .map(a => +a);
        reload = true;
      }
      // Reloading if necessary
      if (reload) {
        this.loadData();
      }
    });
  }

  /**
   * Loads the data for the view
   */
  private loadData() {
    this.loadTransactions(this.currentYear, this.currentMonth, this.accountsFilter);
    this.loadSummary(this.currentYear, this.currentMonth, this.accountsFilter);
    this.loadRepartition(this.currentYear, this.currentMonth, this.accountsFilter);
  }

  /**
   * Loads the list of transactions.
   *
   * @param {number} year the year to filter on
   * @param {number} month the month to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadTransactions(year: number, month: number, accounts: number[]) {
    this.transactionsService.getAll(year, month, accounts).subscribe(data => {
      this.transactions = data.slice(0);
    });
  }

  /**
   * Loads the summary.
   *
   * @param {number} year the year to filter on
   * @param {number} month the month to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadSummary(year: number, month: number, accounts: number[]) {
    this.statisticsService.getSummary(year, month, accounts).subscribe(data => {
      this.summary = data;
    });
  }

  /**
   * Loads the repartition data for building the graph.
   *
   * @param {number} year the year to filter on
   * @param {number} month the month to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadRepartition(year: number, month: number, accounts: number[]) {
    this.statisticsService.getGroupedByLabel(year, month, accounts).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: any) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function () {
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
      options.xAxis.categories.push(d.label);
      options.series[0].data.push(d.value);
    }
    return options;
  }

}
