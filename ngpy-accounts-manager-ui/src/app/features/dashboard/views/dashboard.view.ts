import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Account, Category, Summary } from '../../../core/models/api.models';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { AlertsService } from '../../../core/services/domain/alerts.service';
import { Alerts } from '../../../core/models/domain.models';
import { CategoriesService } from '../../../core/services/domain/categories.service';
import { combineLatest, Subscription } from 'rxjs';
import { StatisticsService } from '../../../core/services/domain/statistics.service';

@Component({
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss']
})
export class DashboardView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public alerts: Alerts;
  public creditCategories: Category[];
  public debitCategories: Category[];
  public rollingMonthSummary: Summary;
  public rollingThreeMonthsSummary: Summary;
  public rollingYearSummary: Summary;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private alertsService: AlertsService,
              private categoriesService: CategoriesService,
              private accountsService: AccountsService,
              private statisticsService: StatisticsService
  ) {
  }

  ngOnInit(): void {
    const subAlerts = combineLatest([
      this.alertsService.getAlerts(),
      this.categoriesService.getCategoriesOfType('C'),
      this.categoriesService.getCategoriesOfType('D')
    ]).subscribe(([alerts, creditCategories, debitCategories]) => {
      this.alerts = alerts;
      this.creditCategories = creditCategories;
      this.debitCategories = debitCategories;
    });
    this.subscriptions.active.add(subAlerts);

    const subAccounts = combineLatest([
      this.accountsService.getActiveAccounts(),
      this.statisticsService.getRollingMonthSummary(undefined),
      this.statisticsService.getRollingThreeMonthsSummary(undefined),
      this.statisticsService.getRollingYearSummary(undefined)
    ]).subscribe(([accounts, rollingMonthSummary, rollingThreeMonthsSummary, rollingYearSummary]) => {
      this.accounts = this.sortAccounts(accounts);
      this.rollingMonthSummary = rollingMonthSummary;
      this.rollingThreeMonthsSummary = rollingThreeMonthsSummary;
      this.rollingYearSummary = rollingYearSummary;
    });
    this.subscriptions.static.add(subAccounts);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  private sortAccounts(accounts: Account[]): Account[] {
    if (accounts == null) {
      return [];
    }
    return accounts.sort((a1, a2) => {
      return a2.total - a1.total;
    });
  }

}
