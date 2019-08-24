import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GroupedValue } from '../../../../core/models/domain.models';

@Component({
  selector: 'app-analytics-details-chart',
  templateUrl: './analytics-details-chart.component.html',
  styleUrls: ['./analytics-details-chart.component.scss']
})
export class AnalyticsDetailsChartComponent implements OnChanges {

  @Input() data: GroupedValue[];
  @Input() chartTitle: string;

  public chartOptions: any;

  constructor(private decimalPipe: DecimalPipe) {
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
  private buildChartOptions(data: any) {
    const that = this;
    const options = {
      chart: {
        type: 'pie'
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.key + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.point.data, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      plotOptions: {
        pie: {
          center: ['50%', '50%']
        },
        series: {
          point: {
            events: {
              legendItemClick: function () {
                const parentName = this.name;
                const details = this.series.chart.series[1].data;
                details.forEach((point) => {
                  if (point.parent === parentName) {
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
        name: 'categories',
        size: '60%',
        data: [],
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }, {
        name: 'labels',
        size: '80%',
        innerSize: '60%',
        data: [],
        allowPointSelect: true
      }]
    };

    let categories = [];
    const series = [];
    for (const group of data) {
      // Adding categories
      categories.push({
        name: group.label,
        y: group.percentage,
        data: group.amount
      });

      // Adding details
      for (const details of group.details) {
        series.push({
          name: details.label,
          y: details.percentage,
          data: details.amount,
          parent: group.label
        })
      }
    }
    options.series[0].data = categories;
    options.series[1].data = series;
    return options;
  }

}
