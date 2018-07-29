import { Component, HostBinding, OnInit } from '@angular/core';
import { AccountsService } from '../../../services/accounts.service';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs/observable/zip';
import { LabelsService } from '../../../services/labels.service';
import { TransactionsService } from '../../../services/transactions.service';
import { Label } from '../../../components/transactions/label';
import { Transaction } from '../../../components/transactions/transaction';
import { CommonFunctions } from '../../../common/common-functions';

@Component({
  templateUrl: './search-view.component.html'
})
export class SearchViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public monthList = CommonFunctions.getMonthsList();
  public currentYear: number;
  public currentMonth: number;
  public accountsFilter: number[];
  public labelsFilter: number[];

  public transactions: Transaction[];
  public accounts: Account[] = [];
  public labels: Label[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelsService: LabelsService,
              private transactionsService: TransactionsService,
              private accountsService: AccountsService
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
      this.loadData();
    });
  }

  changeYear(year: number) {
    this.currentYear = year;
    this.navigate();
  }

  changeMonth(month: number) {
    this.currentMonth = month;
    this.navigate();
  }

  changeAccounts(accounts: Account[]) {
    this.accountsFilter = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.navigate();
  }

  changeLabels(labels: number[]) {
    this.labelsFilter = labels;
    this.navigate();
  }

  saveTransaction(data: any) {}

  private loadData() {
    this.transactionsService.getAll(
      this.currentYear,
      this.currentMonth,
      this.accountsFilter,
      this.labelsFilter
    ).subscribe(data => {
      this.transactions = data.slice(0);
    });
  }

  private navigate() {
    this.router.navigate(['search'], {
      queryParams: {
        year: this.currentYear,
        month: this.currentMonth,
        account: this.accountsFilter ? this.accountsFilter.join(',') : undefined,
        label: this.labelsFilter ? this.labelsFilter.join(',') : undefined
      }
    });
  }

}
