import { Component, HostBinding, OnInit } from '@angular/core';
import { Account, Category } from '../../../core/models/api.models';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { AlertsService } from '../../../core/services/domain/alerts.service';
import { Alerts } from '../../../core/models/domain.models';
import { CategoriesService } from '../../../core/services/domain/categories.service';
import { zip } from 'rxjs';

@Component({
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss']
})
export class DashboardView implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public alerts: Alerts;
  public creditCategories: Category[];
  public debitCategories: Category[];
  public total: number;

  constructor(private alertsService: AlertsService,
              private categoriesService: CategoriesService,
              private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.alertsService.getAlerts(),
      this.categoriesService.getCategoriesOfType('C'),
      this.categoriesService.getCategoriesOfType('D')
    ).subscribe(([alerts, creditCategories, debitCategories]) => {
      this.alerts = alerts;
      this.creditCategories = creditCategories;
      this.debitCategories = debitCategories;
    });
    this.accountsService.getActiveAccounts().subscribe(accounts => {
      this.accounts = this.sortAccounts(accounts);
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
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
