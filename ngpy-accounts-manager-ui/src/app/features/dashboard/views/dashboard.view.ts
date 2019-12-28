import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Account, Category } from '../../../core/models/api.models';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { AlertsService } from '../../../core/services/domain/alerts.service';
import { Alerts } from '../../../core/models/domain.models';
import { CategoriesService } from '../../../core/services/domain/categories.service';
import { combineLatest, Subscription } from 'rxjs';

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
  public total: number;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private alertsService: AlertsService,
              private categoriesService: CategoriesService,
              private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    const subActive = combineLatest([
      this.alertsService.getAlerts(),
      this.categoriesService.getCategoriesOfType('C'),
      this.categoriesService.getCategoriesOfType('D')
    ]).subscribe(([alerts, creditCategories, debitCategories]) => {
      this.alerts = alerts;
      this.creditCategories = creditCategories;
      this.debitCategories = debitCategories;
    });
    this.subscriptions.active.add(subActive);

    const subStatic = this.accountsService.getActiveAccounts().subscribe(accounts => {
      this.accounts = this.sortAccounts(accounts);
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
    this.subscriptions.static.add(subStatic);
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
