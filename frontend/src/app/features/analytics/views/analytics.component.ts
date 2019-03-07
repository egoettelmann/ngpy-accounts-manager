import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { CategoriesRestService } from '../../../core/services/rest/categories-rest.service';
import { StatisticsRestService } from '../../../core/services/rest/statistics-rest.service';
import { Category } from '../../../core/models/category';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import { zip } from 'rxjs/observable/zip';
import * as _ from 'lodash';

@Component({
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public accountsFilter: number[] = [];

  public accounts: Account[];
  public categories: Category[];
  public graphOptionsCredit: any;
  public graphOptionsDebit: any;
  public tableMovements: any[] = [];
  public detailsCredit: any[] = [];
  public detailsDebit: any[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private accountsService: AccountsRestService,
              private categoriesService: CategoriesRestService,
              private statisticsService: StatisticsRestService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    this.initData();
    zip(
      this.accountsService.getAccounts(),
      this.categoriesService.getAll()
    ).subscribe(([accounts, categories]) => {
      this.accounts = accounts.slice(0);
      this.categories = categories.slice(0);
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
   * Initializes the component with the data from the route
   */
  private initData() {
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = CommonFunctions.getCurrentYear();
    } else {
      this.currentYear = +this.route.snapshot.paramMap.get('year');
    }
    if (!this.route.snapshot.queryParamMap.has('account')) {
      this.accountsFilter = [];
    } else {
      this.accountsFilter = this.route.snapshot.queryParamMap.get('account')
        .split(',')
        .map(a => +a);
    }
  }

  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    this.statisticsService.getAnalytics(this.currentYear, 'C', accounts).subscribe(data => {
      this.graphOptionsCredit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'D', accounts).subscribe(data => {
      this.graphOptionsDebit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'M', accounts).subscribe(data => {
      this.tableMovements = this.buildTable(data);
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'C', accounts).subscribe(data => {
      this.detailsCredit = data;
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'D', accounts).subscribe(data => {
      this.detailsDebit = data;
    });

    const url = this.router.createUrlTree(['analytics', this.currentYear], {
      queryParams: {
        'account': accounts ? accounts.join(',') : undefined
      }
    }).toString();
    this.location.go(url);
  }

  /**
   * Builds the aggregation table.
   *
   * @param {any[]} data the data to aggregate
   * @returns {any[]} the aggregated data for the table
   */
  private buildTable(data: any[]) {
    const movements = [];
    const series = {};
    for (const d of data) {
      const categoryIdx = parseInt(d.category, 10) - 1;
      if (!series.hasOwnProperty(d.label)) {
        series[d.label] = [0, 0, 0, 0];
      }
      series[d.label][categoryIdx] = d.value;
    }
    for (const key in series) {
      if (series.hasOwnProperty(key)) {
        movements.push({
          name: key,
          data: series[key]
        });
      }
    }
    return movements;
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
      const categoryIdx = parseInt(d.category, 10) - 1;
      CommonFunctions.resizeArray(categories, 0, categoryIdx);
      categories[categoryIdx] = 'Q' + d.category;
      if (!series.hasOwnProperty(d.label)) {
        series[d.label] = [];
      }
      CommonFunctions.resizeArray(series[d.label], 0, categoryIdx);
      series[d.label][categoryIdx] = d.value;
    }
    options.xAxis.categories = categories;
    for (const key in series) {
      if (series.hasOwnProperty(key)) {
        options.series.push({
          name: key,
          data: series[key]
        });
      }
    }
    return options;
  }

}
