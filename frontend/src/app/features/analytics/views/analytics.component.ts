import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { CategoriesRestService } from '../../../core/services/rest/categories-rest.service';
import { StatisticsRestService } from '../../../core/services/rest/statistics-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import { zip } from 'rxjs';
import * as _ from 'lodash';
import { Account, Category, CompositeKeyValue } from '../../../core/models/api.models';
import { ChartSerie, GroupedValue } from '../../../core/models/domain.models';

@Component({
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public accountsFilter: number[] = [];
  public quarterly = true;

  public accounts: Account[];
  public categories: Category[];
  public analyticsCredit: CompositeKeyValue[];
  public analyticsDebit: CompositeKeyValue[];
  public tableMovements: ChartSerie[] = [];
  public detailsCredit: GroupedValue[] = [];
  public detailsDebit: GroupedValue[] = [];

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
   * Triggered on period change.
   *
   * @param quarterly
   */
  changePeriod(quarterly: boolean) {
    this.quarterly = quarterly;
    this.reloadData();
  }

  /**
   * Gets the label for the period select.
   *
   * @param quarterly
   */
  public getPeriodSelectLabel(quarterly: boolean) {
    return quarterly ? 'i18n.views.analytics.period.select.quarterly' : 'i18n.views.analytics.period.select.monthly';
  }

  get creditChartTitle() {
    return this.quarterly ? 'i18n.views.analytics.quarterly.chart.credit.title' : 'i18n.views.analytics.monthly.chart.credit.title';
  }

  get debitChartTitle() {
    return this.quarterly ? 'i18n.views.analytics.quarterly.chart.debit.title' : 'i18n.views.analytics.monthly.chart.debit.title';
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
    this.statisticsService.getAnalytics(this.currentYear, 'C', accounts, this.quarterly).subscribe(data => {
      this.analyticsCredit = data;
    });
    this.statisticsService.getAnalytics(this.currentYear, 'D', accounts, this.quarterly).subscribe(data => {
      this.analyticsDebit = data;
    });
    this.statisticsService.getAnalytics(this.currentYear, 'M', accounts, this.quarterly).subscribe(data => {
      this.tableMovements = this.buildTable(data);
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'C', accounts).subscribe(data => {
      this.detailsCredit = this.consolidateDetails(data);
    });
    this.statisticsService.getAnalyticsDetails(this.currentYear, 'D', accounts).subscribe(data => {
      this.detailsDebit = this.consolidateDetails(data);
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
  private buildTable(data: CompositeKeyValue[]): ChartSerie[] {
    const movements: ChartSerie[] = [];
    const series = {};
    for (const d of data) {
      const categoryIdx = parseInt(d.keyOne, 10) - 1;
      if (!series.hasOwnProperty(d.keyTwo)) {
        series[d.keyTwo] = [0, 0, 0, 0];
      }
      series[d.keyTwo][categoryIdx] = d.value;
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
   * Consolidates the data into groups.
   *
   * @param details the list of details
   */
  private consolidateDetails(details: CompositeKeyValue[]): any[] {
    const groupsByCategory = {};
    let total = 0;
    for (let i in details) {
      let detail = details[i];
      if (!groupsByCategory.hasOwnProperty(detail.keyOne)) {
        groupsByCategory[detail.keyOne] = [];
      }
      groupsByCategory[detail.keyOne].push({
        label: detail.keyTwo,
        amount: detail.value,
        percentage: 0
      });
      total += detail.value;
    }
    const groupsWithDetails = [];
    for (let g in groupsByCategory) {
      const gd = {
        label: g,
        amount: groupsByCategory[g].reduce((t, a) => t + a.amount, 0),
        details: groupsByCategory[g].sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount)),
        percentage: 0
      };
      groupsByCategory[g].map(g => g.percentage = g.amount / total * 100);
      gd.percentage = gd.amount / total * 100;
      groupsWithDetails.push(gd);
    }
    return groupsWithDetails.sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount));
  }

}