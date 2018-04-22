import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {StatisticsService} from '../../modules/statistics/statistics.service';
import {DecimalPipe} from '@angular/common';
import {Summary} from '../../modules/statistics/summary';
import { Account } from '../../modules/accounts/account';
import { AccountsService } from '../../modules/accounts/accounts.service';

@Component({
  templateUrl: './treasury-view.component.html'
})
export class TreasuryViewComponent implements OnInit {

  public yearList = [2018, 2017, 2016, 2015, 2014];
  public currentYear: any;
  public graphOptions: any;
  public accounts: Account[];
  public summary: Summary;
  public accountsFilter: number[] = [];

  constructor(private $state: StateService,
              private accountsService: AccountsService,
              private statisticsService: StatisticsService,
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
