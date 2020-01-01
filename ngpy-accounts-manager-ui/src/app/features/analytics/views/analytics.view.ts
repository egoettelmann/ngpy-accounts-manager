import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Account, Category, CompositeKeyValue } from '../../../core/models/api.models';
import { GroupedValue } from '../../../core/models/domain.models';
import { StatisticsService } from '../../../core/services/domain/statistics.service';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { RouterService } from '../../../core/services/router.service';
import { CategoriesService } from '../../../core/services/domain/categories.service';
import { DateService } from '../../../core/services/date.service';

@Component({
  templateUrl: './analytics.view.html',
  styleUrls: ['./analytics.view.scss']
})
export class AnalyticsView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  public currentYear: number;
  public accountsFilter: number[] = [];
  public quarterly = true;

  public accounts: Account[];
  public categories: Category[];
  public analyticsCredit: CompositeKeyValue[];
  public analyticsDebit: CompositeKeyValue[];
  public analyticsMovements: CompositeKeyValue[];
  public detailsCredit: GroupedValue[] = [];
  public detailsDebit: GroupedValue[] = [];

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private route: ActivatedRoute,
              private routerService: RouterService,
              private accountsService: AccountsService,
              private categoriesService: CategoriesService,
              private statisticsService: StatisticsService,
              private dateService: DateService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.initData();
    const sub = combineLatest([
      this.accountsService.getAccounts(),
      this.categoriesService.getCategories()
    ]).subscribe(([accounts, categories]) => {
      this.accounts = accounts.slice(0);
      this.categories = categories.slice(0);
      this.reloadData();
    });
    this.subscriptions.static.add(sub);
  }

  /**
   * Triggered once the component is destroyed
   */
  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: number[]) {
    if (!_.isEqual(this.accountsFilter, accounts)) {
      this.accountsFilter = accounts.slice(0);
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
  getPeriodSelectLabel(quarterly: boolean) {
    return quarterly ? 'i18n.views.analytics.period.select.quarterly' : 'i18n.views.analytics.period.select.monthly';
  }

  /**
   * Get the credit chart title
   */
  get creditChartTitle() {
    return this.quarterly ? 'i18n.views.analytics.quarterly.chart.credit.title' : 'i18n.views.analytics.monthly.chart.credit.title';
  }

  /**
   * Get the debit chart title
   */
  get debitChartTitle() {
    return this.quarterly ? 'i18n.views.analytics.quarterly.chart.debit.title' : 'i18n.views.analytics.monthly.chart.debit.title';
  }

  /**
   * Displays the details of a category.
   *
   * @param categoryId the category id
   */
  displayCategoryDetails(categoryId: number) {
    const period = this.quarterly ? 'QUARTER' : 'MONTH';
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    const sub = this.statisticsService.getAnalyticsByLabel(this.currentYear, period, categoryId, accounts).subscribe(data => {
      sub.unsubscribe();
    });
  }

  /**
   * Goes to the list of transactions with a given label.
   *
   * @param labelId the label id
   */
  goToLabelDetails(labelId: number) {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter.join(',') : undefined;
    const minDate = this.dateService.format(this.dateService.getPeriodStart(this.currentYear));
    const maxDate = this.dateService.format(this.dateService.getPeriodEnd(this.currentYear));
    this.routerService.navigate('route.transactions.search', {}, {
      queryParams: {
        labels: '' + labelId,
        minDate: minDate,
        maxDate: maxDate,
        accounts: accounts
      }
    });
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData() {
    this.currentYear = this.routerService.getYear(this.route);
    this.accountsFilter = this.routerService.getAccounts(this.route);
    this.quarterly = this.route.snapshot.queryParamMap.get('quarterly') === 'true';
  }

  /**
   * Reload the data
   */
  private reloadData() {
    const period = this.quarterly ? 'QUARTER' : 'MONTH';
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    const sub = combineLatest([
      this.statisticsService.getAnalyticsByCategory(this.currentYear, period, 'C', accounts),
      this.statisticsService.getAnalyticsByCategory(this.currentYear, period, 'D', accounts),
      this.statisticsService.getAnalyticsByCategory(this.currentYear, period, 'M', accounts),
      this.statisticsService.getAnalyticsRepartition(this.currentYear, 'C', accounts),
      this.statisticsService.getAnalyticsRepartition(this.currentYear, 'D', accounts)
    ]).subscribe(([credits, debits, movements, creditDetails, debitDetails]) => {
      this.analyticsCredit = credits;
      this.analyticsDebit = debits;
      this.analyticsMovements = movements;
      this.detailsCredit = this.consolidateDetails(creditDetails);
      this.detailsDebit = this.consolidateDetails(debitDetails);
    });
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = sub;

    let params = {};
    params = this.routerService.setAccounts(accounts, params);
    params = this.routerService.setYear(this.currentYear, params);
    params['quarterly'] = this.quarterly;
    this.routerService.refresh(this.route, params);
  }

  /**
   * Consolidates the data into groups.
   *
   * @param details the list of details
   */
  private consolidateDetails(details: CompositeKeyValue[]): any[] {
    const groupsByCategory = {};
    let total = 0;
    details.forEach(detail => {
      if (!groupsByCategory.hasOwnProperty(detail.keyOne)) {
        groupsByCategory[detail.keyOne] = [];
      }
      groupsByCategory[detail.keyOne].push({
        label: detail.keyTwo,
        amount: detail.value,
        percentage: 0
      });
      total += detail.value;
    });
    const groupsWithDetails = [];
    Object.keys(groupsByCategory).forEach((key) => {
      const gd = {
        label: key,
        amount: groupsByCategory[key].reduce((t, a) => t + a.amount, 0),
        details: groupsByCategory[key].sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount)),
        percentage: 0
      };
      groupsByCategory[key].map(g => g.percentage = g.amount / total * 100);
      gd.percentage = gd.amount / total * 100;
      groupsWithDetails.push(gd);
    });
    return groupsWithDetails.sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount));
  }

}
