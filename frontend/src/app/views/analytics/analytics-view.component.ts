import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../modules/accounts/accounts.service';
import { Account } from '../../modules/accounts/account';
import { Category } from '../../modules/transactions/category';
import { CategoriesService } from '../../modules/transactions/categories.service';
import { StatisticsService } from '../../modules/statistics/statistics.service';
import { StateService } from '@uirouter/angular';
import { DecimalPipe } from '@angular/common';

@Component({
  templateUrl: './analytics-view.component.html'
})
export class AnalyticsViewComponent implements OnInit {

  public yearList = [2018, 2017, 2016, 2015, 2014];
  public currentYear: string;
  public accounts: Account[];
  public categories: Category[];
  public accountsFilter: number[] = [];
  public graphOptionsCredit: any;
  public graphOptionsDebit: any;
  public tableMovements: any[] = [];
  public detailsCredit: any[] = [];
  public detailsDebit: any[] = [];

  constructor(private $state: StateService,
              private accountsService: AccountsService,
              private categoriesService: CategoriesService,
              private statisticsService: StatisticsService,
              private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.categoriesService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  changeAccounts(accounts: Account[]) {
    const accountIds = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.reload(accountIds);
  }

  private reload(accountIds: number[]) {
    this.$state.go('root.analytics', {
      account: accountIds
    });
    this.statisticsService.getAnalytics(this.currentYear, 'C', accountIds).subscribe(data => {
      this.graphOptionsCredit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'D', accountIds).subscribe(data => {
      this.graphOptionsDebit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'M', accountIds).subscribe(data => {
      this.tableMovements = this.buildTable(data);
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'C', accountIds).subscribe(data => {
      this.detailsCredit = data;
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'D', accountIds).subscribe(data => {
      this.detailsDebit = data;
    });
  }

  buildTable(data: any[]) {
    const movements = [];
    const series = {};
    for (const d of data) {
      const categoryIdx = parseInt(d.category) - 1;
      if (!series.hasOwnProperty(d.label)) {
        series[d.label] = [0, 0, 0, 0];
      }
      series[d.label][categoryIdx] = d.value;
    }
    for (const key in series) {
      movements.push({
        name: key,
        data: series[key]
      });
    }
    return movements;
  }

  buildChartOptions(data: any) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        stackLabels: {
          enabled: true,
          formatter: function() {
            return that.decimalPipe.transform(this.total, '1.2-2') + ' €';
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function() {
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series: []
    };
    const categories = [];
    const series = {};
    for (const d of data) {
      const categoryIdx = parseInt(d.category) - 1;
      this.resizeArray(categories, 0, categoryIdx);
      categories[categoryIdx] = 'Q' + d.category;
      if (!series.hasOwnProperty(d.label)) {
        series[d.label] = [];
      }
      this.resizeArray(series[d.label], 0, categoryIdx);
      series[d.label][categoryIdx] = d.value;
    }
    options.xAxis.categories = categories;
    for (const key in series) {
      options.series.push({
        name: key,
        data: series[key]
      });
    }
    return options;
  }

  private resizeArray(arrayToResize: number[], placeholder: number, maxSize: number) {
    for (let i = arrayToResize.length; i <= maxSize; i++) {
      arrayToResize[i] = placeholder;
    }
  }

}
