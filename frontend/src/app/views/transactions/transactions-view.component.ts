import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { TransactionsService } from '../../modules/transactions/transactions.service';
import { StatisticsService } from '../../modules/statistics/statistics.service';
import { DecimalPipe } from '@angular/common';
import { PatchEvent, Transaction } from '../../modules/transactions/transaction';
import { Summary } from '../../modules/statistics/summary';
import { Account } from '../../modules/accounts/account';
import { AccountsService } from '../../modules/accounts/accounts.service';
import { LabelsService } from '../../modules/transactions/labels.service';
import { Label } from '../../modules/transactions/label';

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
  public accounts: Account[];
  public labels: Label[];
  public selectedAccounts: number[] = [];

  constructor(private $state: StateService,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    if (this.$state.params.account) {
      this.selectedAccounts = this.$state.params.account;
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
      this.labelsService.getAll().subscribe(labels => {
        this.labels = labels.slice(0);
      });
    });
  }

  private loadTransactions(year: string, month: string, accounts: number[]) {
    this.transactionsService.getAll(year, month, accounts).subscribe(data => {
      this.transactions = data.slice(0);
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

  saveTransaction(patchEvent: PatchEvent<Transaction>) {
    console.log('patchEvent', patchEvent);
    this.transactionsService.updateOne(patchEvent.model.id, patchEvent.changes).subscribe(data => {
      console.log('SAVE', data);
    });
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
      account: this.selectedAccounts.length === this.accounts.length ? undefined : this.selectedAccounts
    }, {
      notify: true,
      reload: true
    });
  }

}
