import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { Account, Category, Label, Transaction } from '../../../core/models/api.models';
import { zip } from 'rxjs';
import { TransactionsService } from '../../../core/services/domain/transactions.service';
import { FilterRequest } from '../../../core/models/rql.models';
import { AccountsService } from '../../../core/services/domain/accounts.service';
import { CategoriesService } from '../../../core/services/domain/categories.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public currentSearch: FilterRequest;

  public transactions: Transaction[];
  public accounts: Account[] = [];
  public labels: Label[];
  public categories: Category[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelsService: LabelsRestService,
              private transactionsService: TransactionsService,
              private accountsService: AccountsService,
              private categoriesService: CategoriesService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll(),
      this.categoriesService.getCategories()
    ).subscribe(([accounts, labels, categories]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
      this.categories = categories.slice(0);
    });
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
    this.transactionsService.search({
      filter: filterRequest
    }).subscribe(data => {
      this.transactions = data.slice(0);
    });

  }

}
