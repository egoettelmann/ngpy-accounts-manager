import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { CategoriesService } from '../../../services/categories.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Category } from '../../../components/transactions/category';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountsService: AccountsService,
              private categoriesService: CategoriesService,
              private statisticsService: StatisticsService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    this.currentYear = this.route.snapshot.paramMap.get('year');
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
    const year = this.route.snapshot.paramMap.get('year');
    this.router.navigate(['/analytics', year], {
      queryParams: {
        account: accountIds
      }
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
          formatter: function () {
            return that.decimalPipe.transform(this.total, '1.2-2') + ' €';
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
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
