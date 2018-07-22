import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { StatisticsService } from '../../../services/statistics.service';
import { TransactionsService } from '../../../services/transactions.service';
import { Transaction } from '../../../components/transactions/transaction';
import { Summary } from '../../../components/statistics/summary';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, startWith } from 'rxjs/operators';
import { CommonFunctions } from '../../../common/common-functions';

@Component({
  templateUrl: './treasury-view.component.html'
})
export class TreasuryViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public currentYear: number;
  public accountsFilter: number[] = [];

  public graphOptions: any;
  public accounts: Account[] = [];
  public topTransactionsAsc: Transaction[];
  public topTransactionsDesc: Transaction[];
  public summary: Summary;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountsService: AccountsService,
              private statisticsService: StatisticsService,
              private transactionsService: TransactionsService,
              private decimalPipe: DecimalPipe) {
  }

  ngOnInit(): void {
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = CommonFunctions.getCurrentYear();
      this.changeAccounts([]);
      return;
    }
    this.initOnChanges();
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    this.accountsFilter = accounts.length === this.accounts.length ? undefined : accounts.map(a => a.id);
    this.router.navigate(['treasury', this.currentYear], {
      queryParams: {
        account: this.accountsFilter ? this.accountsFilter.join(',') : undefined
      }
    });
  }

  /**
   * Listens on any route change to reload the data
   */
  private initOnChanges() {
    combineLatest(
      this.route.paramMap.pipe(startWith(undefined)),
      this.route.queryParamMap.pipe(startWith(undefined))
    ).pipe(
      debounceTime(20)
    ).subscribe(([paramMap, queryParamMap]) => {
      let reload = false;
      // Checking if any param has changed
      if (paramMap) {
        this.currentYear = +paramMap.get('year');
        reload = true;
      }
      // Checking if any query param has changed
      this.accountsFilter = undefined;
      if (queryParamMap && queryParamMap.has('account')) {
        this.accountsFilter = queryParamMap.get('account')
          .split(',')
          .map(a => +a);
        reload = true;
      }
      // Reloading if necessary
      if (reload) {
        this.loadData();
      }
    });
  }

  /**
   * Loads the data for the view
   */
  private loadData() {
    this.loadEvolution(this.currentYear, this.accountsFilter);
    this.loadSummary(this.currentYear, this.accountsFilter);
    this.loadTops(this.currentYear, this.accountsFilter);
  }

  /**
   * Loads the evolution data for the graph.
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadEvolution(year: number, accounts: number[]) {
    this.statisticsService.getEvolution(year, accounts).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
  }

  /**
   * Loads the summary.
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadSummary(year: number, accounts: number[]) {
    this.statisticsService.getSummary(year, undefined, accounts).subscribe(data => {
      this.summary = data;
    });
  }

  /**
   * Loads the top transactions (highest credit and debit).
   *
   * @param {number} year the year to filter on
   * @param {number[]} accounts the accounts to filter on
   */
  private loadTops(year: number, accounts: number[]) {
    this.transactionsService.getTop(10, true, year, undefined, accounts).subscribe(data => {
      this.topTransactionsAsc = data;
    });
    this.transactionsService.getTop(10, false, year, undefined, accounts).subscribe(data => {
      this.topTransactionsDesc = data;
    });
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: any) {
    const that = this;
    const options = {
      tooltip: {
        formatter: function () {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories: []
      },
      series: [{
        data: [],
        showInLegend: false
      }]
    };
    for (const d of data) {
      options.xAxis.categories.push(d.label);
      options.series[0].data.push(d.value);
    }
    return options;
  }

}
