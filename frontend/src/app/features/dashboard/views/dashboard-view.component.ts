import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../core/services/rest/accounts.service';
import { Account } from '../../../core/models/account';
import { TransactionsService } from '../../../core/services/rest/transactions.service';
import { zip } from 'rxjs/observable/zip';
import { Router } from '@angular/router';

@Component({
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public unlabeledTransactions: number;
  public total: number;
  public graphOptions: any;

  constructor(private router: Router,
              private accountsService: AccountsService,
              private transactionsService: TransactionsService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    zip(
      this.transactionsService.getAll(undefined, undefined, undefined, [null]),
      this.accountsService.getAccounts()
    ).subscribe(([transactions, accounts]) => {
      this.unlabeledTransactions = transactions.length;
      this.accounts = accounts;
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
      this.graphOptions = this.buildChartOptions(accounts, this.total);
    });
  }

  goToUnlabeledTransactions() {
    this.router.navigate(['search'], {
      queryParams: {
        label: ''
      }
    });
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: Account[], total: number) {
    const that = this;
    const options = {
      chart: {
        type: 'pie'
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.point.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      series: [{
        data: [],
        showInLegend: false
      }]
    };
    for (const d of data) {
      options.series[0].data.push({
        name: d.description,
        color: d.color,
        y: d.total
      });
    }
    return options;
  }

}
