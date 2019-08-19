import { Component, HostBinding, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Account } from '../../../core/models/api.models';
import { TransactionsService } from '../../../core/services/domain/transactions.service';
import { AccountsService } from '../../../core/services/domain/accounts.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public alerts: {
    labels: number,
    categories: number
  };
  public total: number;

  constructor(private router: Router,
              private accountsService: AccountsService,
              private transactionsService: TransactionsService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.transactionsService.countUnlabeled(),
      this.transactionsService.countWronglyCategorized(),
      this.accountsService.getActiveAccounts()
    ).subscribe(([labelErrors, categoryErrors, accounts]) => {
      this.alerts = {
        labels: labelErrors,
        categories : categoryErrors
      };
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
