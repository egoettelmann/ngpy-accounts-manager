import { Component, HostBinding, OnInit } from '@angular/core';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { Account } from '../../../core/models/api.models';
import { TransactionsService } from '../../../core/services/domain/transactions.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public unlabeledTransactions: number;
  public total: number;

  constructor(private router: Router,
              private accountsService: AccountsRestService,
              private transactionsService: TransactionsService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.transactionsService.countUnlabeled(),
      this.accountsService.getAccounts()
    ).subscribe(([numUnlabeled, accounts]) => {
      this.unlabeledTransactions = numUnlabeled;
      this.accounts = accounts;
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
  }

  goToUnlabeledTransactions() {
    this.router.navigate(['search'], {
      queryParams: {
        label: ''
      }
    });
  }

}
