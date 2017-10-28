import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountsService} from "../../modules/accounts/accounts.service";

@Component({
  templateUrl: './dashboard-view.component.html'
})
export class DashboardViewComponent implements OnInit {

  public accounts: any[];
  public total: number;

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.accountsService.getAccounts().then(data => {
      this.accounts = data;
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
  }

}
