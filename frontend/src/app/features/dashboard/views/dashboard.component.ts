import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsRestService } from '../../../core/services/rest/accounts-rest.service';
import { TransactionsRestService } from '../../../core/services/rest/transactions-rest.service';
import { zip } from 'rxjs/observable/zip';
import { Router } from '@angular/router';
import { Account } from '../../../core/models/api.models';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  public accounts: Account[];
  public unlabeledTransactions: number;
  public total: number;
  public graphOptions: any;

  constructor(private router: Router,
              private accountsService: AccountsRestService,
              private transactionsService: TransactionsRestService,
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
