import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GroupedValue } from '@core/models/domain.models';
import { ToLabelPipe } from '@shared/pipes/to-label.pipe';
import { ToCategoryPipe } from '@shared/pipes/to-category.pipe';
import { Options, PointOptionsObject } from 'highcharts';

@Component({
  selector: 'app-analytics-pie-chart',
  templateUrl: './analytics-pie-chart.component.html',
  styleUrls: ['./analytics-pie-chart.component.scss']
})
export class AnalyticsPieChartComponent implements OnChanges {

  @Input() data?: GroupedValue[];
  @Input() chartTitle?: string;

  public chartOptions: any;

  constructor(private decimalPipe: DecimalPipe,
              private toLabelPipe: ToLabelPipe,
              private toCategoryPipe: ToCategoryPipe
  ) {
  }

  /**
   * Triggered chen the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
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
                  if (point.options?.custom?.parent === parentName) {
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
            return '<b>' + that.toCategoryPipe.transform(+this.name, 'name') + '</b><br/>'
              + '<b>' + that.decimalPipe.transform(this.options?.custom?.amount, '1.2-2') + ' €</b>'
              + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
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
            return '<b>' + that.toLabelPipe.transform(+this.name, 'name') + '</b><br/>'
              + '<b>' + that.decimalPipe.transform(this.options?.custom?.amount, '1.2-2') + ' €</b>'
              + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
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
