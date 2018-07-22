import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { CategoriesService } from '../../../services/categories.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Category } from '../../../components/transactions/category';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../common/common-functions';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, startWith } from 'rxjs/operators';
import { zip } from 'rxjs/observable/zip';

@Component({
  templateUrl: './analytics-view.component.html'
})
export class AnalyticsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public currentYear: number;
  public accountsFilter: number[] = [];

  public accounts: Account[] = [];
  public categories: Category[];
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
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = CommonFunctions.getCurrentYear();
      this.changeAccounts([]);
      return;
    }
    this.initOnChanges();
    zip(
      this.accountsService.getAccounts(),
      this.categoriesService.getAll()
    ).subscribe(([accounts, categories]) => {
      this.accounts = accounts.slice(0);
      this.categories = categories.slice(0);
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    this.accountsFilter = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.router.navigate(['analytics', this.currentYear], {
      queryParams: {
        account: this.accountsFilter ? this.accountsFilter.join(',') : undefined
      }
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

  private loadData() {
    this.statisticsService.getAnalytics(this.currentYear, 'C', this.accountsFilter).subscribe(data => {
      this.graphOptionsCredit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'D', this.accountsFilter).subscribe(data => {
      this.graphOptionsDebit = this.buildChartOptions(data);
    });
    this.statisticsService.getAnalytics(this.currentYear, 'M', this.accountsFilter).subscribe(data => {
      this.tableMovements = this.buildTable(data);
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'C', this.accountsFilter).subscribe(data => {
      this.detailsCredit = data;
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'D', this.accountsFilter).subscribe(data => {
      this.detailsDebit = data;
    });
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
