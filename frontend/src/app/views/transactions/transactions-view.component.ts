import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { TransactionsService } from '../../modules/transactions/transactions.service';
import { StatisticsService } from '../../modules/statistics/statistics.service';
import { DecimalPipe } from '@angular/common';
import { Transaction } from '../../modules/transactions/transaction';
import * as JsonPatch from 'fast-json-patch';
import { Summary } from '../../modules/statistics/summary';
import { Account } from '../../modules/accounts/account';
import { AccountsService } from '../../modules/accounts/accounts.service';
import { RestService } from '../../modules/shared/rest.service';

@Component({
  templateUrl: './transactions-view.component.html'
})
export class TransactionsViewComponent implements OnInit {

  public yearList = [2018, 2017, 2016, 2015, 2014];
  public monthList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  public currentYear: number;
  public transactions: Transaction[];
  public graphOptions: any;
  public summary: Summary;
  public selectedTransaction: Transaction;
  public accounts: Account[];
  public selectedAccounts: number[] = [];

  constructor(private $state: StateService,
              private restService: RestService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    if (this.$state.params.accounts) {
      this.selectedAccounts = this.restService.decode(
        this.$state.params.accounts
      );
    }
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
      if (this.selectedAccounts.length === 0 && this.accounts) {
        this.selectedAccounts = this.accounts.map(a => a.id);
      }
      this.loadTransactions(
        this.$state.params.year,
        this.$state.params.month,
        this.selectedAccounts.length === this.accounts.length ? undefined : this.selectedAccounts
      );
      this.loadSummary(
        this.$state.params.year,
        this.$state.params.month,
        this.selectedAccounts.length === this.accounts.length ? undefined : this.selectedAccounts
      );
      this.loadRepartition(
        this.$state.params.year,
        this.$state.params.month,
        this.selectedAccounts.length === this.accounts.length ? undefined : this.selectedAccounts
      );
    });
  }

  private loadTransactions(year: string, month: string, accounts: number[]) {
    this.transactionsService.getAll(year, month, accounts).subscribe(data => {
      this.transactions = data;
    });
  }

  private loadSummary(year: string, month: string, accounts: number[]) {
    this.statisticsService.getSummary(year, month, accounts).subscribe(data => {
      this.summary = data;
    });
  }

  private loadRepartition(year: string, month: string, accounts: number[]) {
    this.statisticsService.getGroupedByLabel(year, month, accounts).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
  }

  buildChartOptions(data: any) {
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

  editTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
  }

  saveTransaction(transaction: Transaction) {
    const diff = JsonPatch.compare(this.selectedTransaction, transaction);
    if (diff.length > 0) {
      this.transactionsService.updateOne(this.selectedTransaction.id, diff).subscribe(data => {
        console.log('SAVE', data);
      });
    }
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionsService.deleteOne(transaction).subscribe(data => {
      console.log('DELETE', data);
    });
  }

  isSelected(account: Account): boolean {
    if (this.selectedAccounts) {
      return this.selectedAccounts.indexOf(account.id) > -1;
    }
    return false;
  }

  toggleAccount(account: Account) {
    if (this.isSelected(account)) {
      const idx = this.selectedAccounts.indexOf(account.id);
      if (this.selectedAccounts.length > 1) {
        this.selectedAccounts.splice(idx, 1);
      }
    } else {
      this.selectedAccounts.push(account.id);
    }
    this.reload();
  }

  toggleAllAccounts() {
    this.selectedAccounts = this.accounts.map(a => a.id);
    this.reload();
  }

  private reload() {
    this.$state.go('root.transactions', {
      accounts: this.restService.encode(
        this.selectedAccounts.length === this.accounts.length ? undefined : this.selectedAccounts
      )
    }, {
      notify: true,
      reload: false
    });
  }

}
