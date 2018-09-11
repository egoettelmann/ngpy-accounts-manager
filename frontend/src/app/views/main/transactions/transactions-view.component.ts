import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { LabelsService } from '../../../services/labels.service';
import { TransactionsService } from '../../../services/transactions.service';
import { StatisticsService } from '../../../services/statistics.service';
import { AccountsService } from '../../../services/accounts.service';
import { Transaction } from '../../../components/transactions/transaction';
import { Summary } from '../../../components/statistics/summary';
import { Label } from '../../../components/transactions/label';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs/observable/zip';
import { CommonFunctions } from '../../../common/common-functions';
import * as _ from 'lodash';

@Component({
  templateUrl: './transactions-view.component.html'
})
export class TransactionsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[];

  public transactions: Transaction[];
  public graphOptions: any;
  public summary: Summary;
  public accounts: Account[];
  public labels: Label[];

  selectedTransaction: Transaction;
  showModal = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
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
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  /**
   * Closes the modal with the transaction form.
   */
  closeModal() {
    this.showModal = false;
    this.selectedTransaction = undefined;
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
    if (transaction.id != null) {
      this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
        this.reloadData();
        this.closeModal();
      });
    } else {
      this.transactionsService.createOne(transaction).subscribe(() => {
        this.reloadData();
        this.closeModal();
      });
    }
  }

  /***
   * Deletes a given transaction.
   *
   * @param {Transaction} transaction the transaction to delete
   */
  deleteTransaction(transaction: Transaction) {
    this.transactionsService.deleteOne(transaction).subscribe(() => {
      this.reloadData();
      this.closeModal();
    });
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
    if (!this.route.snapshot.paramMap.has('month')) {
      this.currentMonth = CommonFunctions.getCurrentMonth();
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
   * Loads the data for the view
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    this.loadTransactions(this.currentYear, this.currentMonth, accounts);
    this.loadSummary(this.currentYear, this.currentMonth, accounts);
    this.loadRepartition(this.currentYear, this.currentMonth, accounts);

    const url = this.router.createUrlTree(['transactions', this.currentYear, this.currentMonth], {
      queryParams: {
        'account': accounts ? accounts.join(',') : undefined
      }
    }).toString();
    this.location.go(url);
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
