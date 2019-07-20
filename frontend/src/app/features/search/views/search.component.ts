import { Component, HostBinding, OnInit } from '@angular/core';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs/observable/zip';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { TransactionsRestService } from '../../../core/services/rest/transactions-rest.service';
import { Label } from '../../../core/models/label';
import { Transaction } from '../../../core/models/transaction';
import { CommonFunctions } from '../../../shared/utils/common-functions';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public monthList = CommonFunctions.getMonthsList();
  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[];
  public labelsFilter: number[];
  public descFilter: string;

  public transactions: Transaction[];
  public accounts: Account[] = [];
  public labels: Label[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelsService: LabelsRestService,
              private transactionsService: TransactionsRestService,
              private accountsService: AccountsRestService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ).subscribe(([accounts, labels]) => {
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
    });
    this.initOnChanges();
  }

  /**
   * Init query param change listeners
   */
  initOnChanges() {
    this.route.queryParamMap.subscribe(value => {
      this.currentYear = value.has('year') ? +value.get('year') : undefined;
      this.currentMonth = value.has('month') ? +value.get('month') : undefined;
      this.accountsFilter = undefined;
      if (value.has('account')) {
        this.accountsFilter = value.get('account')
          .split(',')
          .map(a => +a);
      }
      this.labelsFilter = undefined;
      if (value.has('label')) {
        this.labelsFilter = value.get('label')
          .split(',')
          .map(a => a === '' ? null : +a);
      }
      this.descFilter = value.get('desc');
      this.loadData();
    });
  }

  /**
   * Change the year to filter on.
   *
   * @param year the new year
   */
  changeYear(year: number) {
    this.currentYear = year;
    this.navigate();
  }

  /**
   * Change the month to filter on.
   *
   * @param month the new month
   */
  changeMonth(month: number) {
    this.currentMonth = month;
    this.navigate();
  }

  /**
   * Change the accounts to filter on.
   *
   * @param accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    this.accountsFilter = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.navigate();
  }

  /**
   * Change the labels to filter on.
   *
   * @param labels the new list of labels
   */
  changeLabels(labels: number[]) {
    this.labelsFilter = labels;
    this.navigate();
  }

  /**
   * Saves a transaction.
   *
   * @param transaction the transaction to save
   */
  saveTransaction(transaction: Transaction) {
    this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
      this.loadData();
    });
  }

  /**
   * Reload the current page with the new query params.
   */
  navigate() {
    this.router.navigate(['search'], {
      queryParams: {
        year: this.currentYear,
        month: this.currentMonth,
        account: this.accountsFilter ? this.accountsFilter.join(',') : undefined,
        label: this.labelsFilter ? this.labelsFilter.join(',') : undefined,
        desc: this.descFilter !== '' ? this.descFilter : undefined
      }
    });
  }

  /**
   * Loads the data based on the selected filters
   */
  private loadData() {
    this.transactionsService.getAll(
      this.currentYear,
      this.currentMonth,
      this.accountsFilter,
      this.labelsFilter,
      this.descFilter
    ).subscribe(data => {
      this.transactions = data.slice(0);
    });
  }

}
