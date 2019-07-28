import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Account } from '../../../../core/models/api.models';
import { ResponsiveService } from '../../../../core/services/responsive.service';

@Component({
  selector: 'app-dashboard-accounts-chart',
  templateUrl: './dashboard-accounts-chart.component.html',
  styleUrls: ['./dashboard-accounts-chart.component.scss']
})
export class DashboardAccountsChartComponent implements OnInit, OnChanges {

  @Input() chartTitle: string;
  @Input() accounts: Account[];

  public graphOptions: any;

  private isMediumOrUp;

  constructor(
    private responsiveService: ResponsiveService,
    private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit() {
    this.isMediumOrUp = this.responsiveService.isMediumOrUp();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accounts && this.accounts) {
      this.graphOptions = this.buildChartOptions(this.accounts);
    }
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: Account[]) {
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
        showInLegend: !this.isMediumOrUp,
        innerSize: '60%',
        dataLabels: {
          enabled: this.isMediumOrUp
        },
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
