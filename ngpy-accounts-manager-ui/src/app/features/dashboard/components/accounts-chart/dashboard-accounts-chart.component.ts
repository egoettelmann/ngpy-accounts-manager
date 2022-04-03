import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Account } from '@core/models/api.models';
import { ResponsiveService } from '@core/services/responsive.service';
import { Options, PointOptionsObject } from 'highcharts';

@Component({
  selector: 'app-dashboard-accounts-chart',
  templateUrl: './dashboard-accounts-chart.component.html',
  styleUrls: ['./dashboard-accounts-chart.component.scss']
})
export class DashboardAccountsChartComponent implements OnInit, OnChanges {

  @Input() chartTitle?: string;
  @Input() accounts?: Account[];

  public graphOptions: any;

  private isMediumOrUp?: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
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
  private buildChartOptions(data: Account[]): Options {
    const that = this;
    const series = this.buildChartSeries(data);
    return {
      chart: {
        type: 'pie'
      },
      tooltip: {
        formatter(): string {
          return '<b>' + this.point.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      series: [{
        type: 'pie',
        data: series,
        showInLegend: !this.isMediumOrUp,
        innerSize: '60%',
        dataLabels: {
          enabled: this.isMediumOrUp
        }
      }]
    };
  }

  private buildChartSeries(values: Account[]): PointOptionsObject[] {
    const series: PointOptionsObject[] = [];
    for (const d of values) {
      series.push({
        name: d.description,
        color: d.color,
        y: d.total
      });
    }
    return series;
  }

}
