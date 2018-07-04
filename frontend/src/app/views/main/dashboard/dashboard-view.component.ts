import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { Account } from '../../../components/accounts/account';

@Component({
  templateUrl: './dashboard-view.component.html',
  host: {'class': 'content-area'}
})
export class DashboardViewComponent implements OnInit {

  public accounts: Account[];
  public total: number;
  public graphOptions: any;

  constructor(private accountsService: AccountsService,
              private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe(data => {
      this.accounts = data;
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
      this.graphOptions = this.buildChartOptions(data, this.total);
    });
  }

  buildChartOptions(data: Account[], total: number) {
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
