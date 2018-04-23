import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../modules/accounts/accounts.service';
import { Account } from '../../modules/accounts/account';
import { Category } from '../../modules/transactions/category';
import { CategoriesService } from '../../modules/transactions/categories.service';

@Component({
  templateUrl: './analytics-view.component.html'
})
export class AnalyticsViewComponent implements OnInit {

  public accounts: Account[];
  public categories: Category[];

  constructor(private accountsService: AccountsService,
              private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.categoriesService.getAll().subscribe(data => {
      this.categories = data;
    })
  }

}
