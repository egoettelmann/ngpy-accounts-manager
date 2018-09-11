import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { StatisticsService } from '../../../services/statistics.service';
import { TransactionsService } from '../../../services/transactions.service';
import { Transaction } from '../../../components/transactions/transaction';
import { Summary } from '../../../components/statistics/summary';
import { Account } from '../../../components/accounts/account';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../common/common-functions';
import * as _ from 'lodash';

@Component({
  templateUrl: './treasury-view.component.html'
})
export class TreasuryViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public yearList = CommonFunctions.getYearsList();
  public currentYear: number;
  public accountsFilter: number[] = [];

  public graphOptions: any;
  public accounts: Account[];
  public topTransactionsAsc: Transaction[];
  public topTransactionsDesc: Transaction[];
  public summary: Summary;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private accountsService: AccountsService,
              private statisticsService: StatisticsService,
              private transactionsService: TransactionsService,
              private decimalPipe: DecimalPipe) {
  }

  ngOnInit(): void {
    this.initData();
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
      this.reloadData();
    });
  }

  /**
   * Triggered on account change.
   *
   * @param {Account[]} accounts the new list of accounts
   */
  changeAccounts(accounts: Account[]) {
    const newFilter = accounts.length === this.accounts.length ? [] : accounts.map(a => a.id);
    if (!_.isEqual(this.accountsFilter, newFilter)) {
      this.accountsFilter = newFilter;
      this.reloadData();
    }
  }

  /**
   * Triggered on year change.
   *
   * @param year
   */
  changeYear(year: number) {
    this.currentYear = year;
    this.reloadData();
  }

  /**
   * Initializes the component with the data from the route
   */
  private initData() {
    if (!this.route.snapshot.paramMap.has('year')) {
      this.currentYear = CommonFunctions.getCurrentYear();
    } else {
      this.currentYear = +this.route.snapshot.paramMap.get('year');
    }
    if (!this.route.snapshot.queryParamMap.has('account')) {
      this.accountsFilter = [];
    } else {
      this.accountsFilter = this.route.snapshot.queryParamMap.get('account')
        .split(',')
        .map(a => +a);
    }
  }

  /**
   * Loads the data for the view
   */
  private reloadData() {
    const accounts = this.accountsFilter.length > 0 ? this.accountsFilter : undefined;
    this.loadEvolution(this.currentYear, accounts);
    this.loadSummary(this.currentYear, accounts);
    this.loadTops(this.currentYear, accounts);

    const url = this.router.createUrlTree(['treasury', this.currentYear], {
      queryParams: {
        'account': accounts ? accounts.join(',') : undefined
      }
    }).toString();
    this.location.go(url);
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
