import { Component, HostBinding, OnInit } from '@angular/core';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsRestService } from '../../../core/services/rest/labels-rest.service';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import { Account, Label, Transaction } from '../../../core/models/api.models';
import { zip } from 'rxjs';
import { TransactionsService } from '../../../core/services/domain/transactions.service';
import { RqlService } from '../../../core/services/rql.service';
import { FilterOperator, FilterRequest } from '../../../core/models/rql.models';

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
              private transactionsService: TransactionsService,
              private accountsService: AccountsRestService,
              private rqlService: RqlService
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
    let dateFrom: Date;
    let dateTo: Date;
    if (this.currentYear != null) {
      dateFrom = new Date(this.currentYear, 0, 1);
      dateTo = new Date(this.currentYear + 1, 0, 1);
      if (this.currentMonth != null) {
        dateFrom.setMonth(this.currentMonth);
        dateTo.setFullYear(this.currentYear);
        dateTo.setMonth(this.currentMonth === 11 ? 0 : this.currentMonth + 1);
      }
    }
    const filters: FilterRequest[] = [];

    // Building the filters
    if (this.labelsFilter && this.labelsFilter.length > 0) {
      const labels = this.rqlService.formatList(this.labelsFilter);
      filters.push(FilterRequest.of('labelId', labels, FilterOperator.IN));
    }
    if (this.accountsFilter && this.accountsFilter.length > 0) {
      const accounts = this.rqlService.formatList(this.accountsFilter);
      filters.push(FilterRequest.of('accountId', accounts, FilterOperator.IN));
    }
    if (this.descFilter) {
      filters.push(FilterRequest.of('description', this.descFilter, FilterOperator.CT));
    }
    if (dateFrom && dateTo) {
      const minDate = this.rqlService.formatDate(dateFrom);
      filters.push(FilterRequest.of('dateValue', minDate, FilterOperator.GE));
    }
    if (dateTo) {
      const maxDate = this.rqlService.formatDate(dateTo);
      filters.push(FilterRequest.of('dateValue', maxDate, FilterOperator.LT));
    }

    if (filters.length > 0) {
      this.transactionsService.search({
        filter: FilterRequest.all(...filters)
      }).subscribe(data => {
        this.transactions = data.slice(0);
      });
    }

  }

}
