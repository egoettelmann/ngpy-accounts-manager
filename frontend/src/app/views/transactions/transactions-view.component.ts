import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { DecimalPipe } from '@angular/common';
import { PatchEvent, Transaction } from '../../modules/transactions/transaction';
import { Summary } from '../../modules/statistics/summary';
import { Account } from '../../modules/accounts/account';
import { Label } from '../../modules/transactions/label';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import { LabelsService } from '../../services/labels.service';
import { TransactionsService } from '../../services/transactions.service';
import { StatisticsService } from '../../services/statistics.service';
import { AccountsService } from '../../services/accounts.service';

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
  public accountsFilter: number[] = [];

  constructor(private $state: StateService,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private accountsService: AccountsService,
              private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    if (this.$state.params.account) {
      this.accountsFilter = this.$state.params.account;
    }
    Observable.zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ).subscribe(([accounts, labels]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
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
    this.transactionsService.updateOne(patchEvent.model.id, patchEvent.changes).subscribe(data => {
      console.log('SAVE', data);
    });
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionsService.deleteOne(transaction).subscribe(data => {
      console.log('DELETE', data);
    });
  }

  changeAccounts(accounts: Account[]) {
    const accountIds = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.reload(accountIds);
  }

  private reload(accountIds: number[]) {
    this.$state.go('root.transactions', {
      account: accountIds
    });
    this.loadTransactions(this.$state.params.year, this.$state.params.month, accountIds);
    this.loadSummary(this.$state.params.year, this.$state.params.month, accountIds);
    this.loadRepartition(this.$state.params.year, this.$state.params.month, accountIds);
  }

}
