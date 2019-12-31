import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Account, Category, Label, Transaction } from '../../../../core/models/api.models';
import { combineLatest, Subscription } from 'rxjs';
import { TransactionsService } from '../../../../core/services/domain/transactions.service';
import { FilterRequest } from '../../../../core/models/rql.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import { CategoriesService } from '../../../../core/services/domain/categories.service';
import { LabelsService } from '../../../../core/services/domain/labels.service';

@Component({
  templateUrl: './transactions-search.view.html',
  styleUrls: ['./transactions-search.view.scss']
})
export class TransactionsSearchView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  public currentSearch: FilterRequest;

  public transactions: Transaction[];
  public accounts: Account[] = [];
  public labels: Label[];
  public categories: Category[];

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private accountsService: AccountsService,
              private categoriesService: CategoriesService
  ) {
  }

  ngOnInit(): void {
    const sub = combineLatest([
      this.accountsService.getAccounts(),
      this.labelsService.getLabels(),
      this.categoriesService.getCategories()
    ]).subscribe(([accounts, labels, categories]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
      this.categories = categories.slice(0);
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  /**
   * Saves a transaction.
   *
   * @param transaction the transaction to save
   */
  saveTransaction(transaction: Transaction) {
    this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
      this.loadData(this.currentSearch);
    });
  }

  /**
   * Loads the data based on the selected filters
   */
  loadData(filterRequest: FilterRequest) {
    this.currentSearch = filterRequest;
    const sub = this.transactionsService.search({
      filter: filterRequest
    }).subscribe(data => {
      this.transactions = data.slice(0);
    });
    this.subscriptions.active.unsubscribe();
    this.subscriptions.active = sub;

  }

}
