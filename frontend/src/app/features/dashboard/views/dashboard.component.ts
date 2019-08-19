import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../../core/models/api.models';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { AlertsService } from '../../../core/services/domain/alerts.service';
import { Alerts } from '../../../core/models/domain.models';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public alerts: Alerts;
  public total: number;

  constructor(private router: Router,
              private alertsService: AlertsService,
              private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    this.alertsService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
    });
    this.accountsService.getActiveAccounts().subscribe(accounts => {
      this.accounts = this.sortAccounts(accounts);
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
  }

  goToLabelAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        labels: ''
      }
    });
  }

  goToCategoryCreditAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        categories: '2,3,5',
        minAmount: 0
      }
    });
  }

  goToCategoryDebitAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        categories: '1,4',
        maxAmount: 0
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
