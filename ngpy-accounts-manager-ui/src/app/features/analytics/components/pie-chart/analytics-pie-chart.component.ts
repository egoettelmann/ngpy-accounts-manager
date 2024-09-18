import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GroupedValue } from '@core/models/domain.models';
import { ToLabelPipe } from '@shared/pipes/to-label.pipe';
import { ToCategoryPipe } from '@shared/pipes/to-category.pipe';
import { Options, PointOptionsObject } from 'highcharts';
import { ChartComponent } from '@shared/components/chart/chart.component';
import { FormatService } from '@core/services/format.service';

@Component({
  standalone: true,
  selector: 'app-analytics-pie-chart',
  templateUrl: './analytics-pie-chart.component.html',
  styleUrls: ['./analytics-pie-chart.component.scss'],
  imports: [
    ChartComponent
  ]
})
export class AnalyticsPieChartComponent implements OnChanges {

  @Input() data?: GroupedValue[];
  @Input() chartTitle?: string;

  public chartOptions: any;

  constructor(private toLabelPipe: ToLabelPipe,
              private toCategoryPipe: ToCategoryPipe,
              private formatService: FormatService
  ) {
  }

  /**
   * Triggered chen the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartOptions = this.buildChartOptions(this.data);
    }
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param data the graph data
   * @returns the chart options
   */
  private buildChartOptions(data: GroupedValue[]): Options {
    const that = this;
    const [categories, series] = this.buildChartSeries(data);
    return {
      chart: {
        type: 'pie'
      },
      legend: {
        labelFormatter(): string {
          return that.toCategoryPipe.transform(+this.name, 'name');
        }
      },
      tooltip: {
        useHTML: true
      },
      plotOptions: {
        pie: {
          center: ['50%', '50%'],
          dataLabels: {
            formatter(): string {
              if (this.key == null) {
                return '';
              }
              return that.toLabelPipe.transform(+this.key, 'name');
            }
          }
        },
        series: {
          point: {
            events: {
              legendItemClick(): void {
                const parentName = this.name;
                const details = this.series.chart.series[1].data;
                details.forEach((point) => {
                  if (point.options?.custom?.['parent'] === parentName) {
                    if (point.visible) {
                      point.setVisible(false);
                    } else {
                      point.setVisible(true);
                    }
                  }
                });
              }
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'categories',
        size: '60%',
        data: categories,
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        tooltip: {
          headerFormat: '',
          pointFormatter(): string {
            return '<table class="tip">'
              + '<caption><b>' + that.toCategoryPipe.transform(+this.name, 'name') + '</b></caption>'
              + '<tbody>'
              + '<tr>'
              + '<td><b>' + that.formatService.formatNumber(this.options?.custom?.['amount']) + ' €</b></td>'
              + '<td>(' + that.formatService.formatNumber(this.percentage) + '%)</td>'
              + '</tr>'
              + '</tbody></table>';
          }
        }
      }, {
        type: 'pie',
        name: 'labels',
        size: '80%',
        innerSize: '60%',
        data: series,
        allowPointSelect: true,
        tooltip: {
          headerFormat: '',
          pointFormatter(): string {
            return '<table class="tip">'
              + '<caption><b>' + that.toLabelPipe.transform(+this.name, 'name') + '</b></caption>'
              + '<tbody>'
              + '<tr>'
              + '<td><b>' + that.formatService.formatNumber(this.options?.custom?.['amount']) + ' €</b></td>'
              + '<td>(' + that.formatService.formatNumber(this.percentage) + '%)</td>'
              + '</tr>'
              + '</tbody></table>';
          }
        }
      }]
    };
  }

  private buildChartSeries(values: GroupedValue[]): PointOptionsObject[][] {
    const categories: PointOptionsObject[] = [];
    const series: PointOptionsObject[] = [];
    for (const group of values) {
      // Adding categories
      categories.push({
        name: group.label,
        y: group.percentage,
        custom: {
          amount: group.amount
        },
        color: this.toCategoryPipe.transform(+group.label, 'color')
      });

      if (group.details == null) {
        continue;
      }

      // Adding details
      for (const details of group.details) {
        series.push({
          name: details.label,
          y: details.percentage,
          custom: {
            amount: details.amount,
            parent: group.label
          },
          color: this.toLabelPipe.transform(+details.label, 'color')
        });
      }
    }
    return [categories, series];
  }

}
