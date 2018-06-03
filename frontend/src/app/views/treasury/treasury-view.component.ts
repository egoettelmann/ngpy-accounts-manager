import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {DecimalPipe} from '@angular/common';
import {Summary} from '../../modules/statistics/summary';
import { Account } from '../../modules/accounts/account';
import { Transaction } from '../../modules/transactions/transaction';
import { AccountsService } from '../../services/accounts.service';
import { StatisticsService } from '../../services/statistics.service';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  templateUrl: './treasury-view.component.html'
})
export class TreasuryViewComponent implements OnInit {

  public yearList = [2018, 2017, 2016, 2015, 2014];
  public currentYear: any;
  public graphOptions: any;
  public accounts: Account[];
  public topTransactionsAsc: Transaction[];
  public topTransactionsDesc: Transaction[];
  public summary: Summary;
  public accountsFilter: number[] = [];

  constructor(private $state: StateService,
              private accountsService: AccountsService,
              private statisticsService: StatisticsService,
              private transactionsService: TransactionsService,
              private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    if (this.$state.params.account) {
      this.accountsFilter = this.$state.params.account;
    }
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }

  changeAccounts(accounts: Account[]) {
    const accountIds = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.reload(accountIds);
  }

  private reload(accountIds: number[]) {
    this.$state.go('root.treasury', {
      account: accountIds
    });
    this.loadEvolution(this.$state.params.year, accountIds);
    this.loadSummary(this.$state.params.year, accountIds);
    this.loadTops(this.$state.params.year, accountIds);
  }

  private loadEvolution(year: string, accounts: number[]) {
    this.statisticsService.getEvolution(year, accounts).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
  }

  private loadSummary(year: string, accounts: number[]) {
    this.statisticsService.getSummary(year, undefined, accounts).subscribe(data => {
      this.summary = data;
    });
  }

  private loadTops(year: string, accounts: number[]) {
    this.transactionsService.getTop(10, true, year, undefined, accounts).subscribe(data => {
      this.topTransactionsAsc = data;
    });
    this.transactionsService.getTop(10, false, year, undefined, accounts).subscribe(data => {
      this.topTransactionsDesc = data;
    });
  }

  buildChartOptions(data: any) {
    const that = this;
    const options = {
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
