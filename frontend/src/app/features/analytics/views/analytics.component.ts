import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  public analyticsCredit: any[];
  public analyticsDebit: any[];
  public tableMovements: any[] = [];
  public detailsCredit: any[] = [];
  public detailsDebit: any[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private accountsService: AccountsRestService,
              private categoriesService: CategoriesRestService,
              private statisticsService: StatisticsRestService
  ) {
  }

  /**
   * Initializes the component
   */
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

  /**
   * Reload the data
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    this.statisticsService.getAnalytics(this.currentYear, 'C', accounts).subscribe(data => {
      this.analyticsCredit = data;
    });
    this.statisticsService.getAnalytics(this.currentYear, 'D', accounts).subscribe(data => {
      this.analyticsDebit = data;
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

}
