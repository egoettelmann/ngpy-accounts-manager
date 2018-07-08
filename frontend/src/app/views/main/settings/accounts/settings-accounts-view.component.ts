import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../../components/accounts/account';
import { AccountsService } from '../../../../services/accounts.service';

@Component({
  templateUrl: './settings-accounts-view.component.html',
  styleUrls: ['./settings-accounts-view.component.scss']
})
export class SettingsAccountsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  accounts: Account[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountsService: AccountsService) {
  }

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe(accounts => {
      this.accounts = accounts.slice(0);
    });
  }

}
