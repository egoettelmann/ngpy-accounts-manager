import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonFunctions } from '../../../../shared/utils/common-functions';

@Component({
  selector: 'app-analytics-details-chart',
  templateUrl: './analytics-details-chart.component.html',
  styleUrls: ['./analytics-details-chart.component.scss']
})
export class AnalyticsDetailsChartComponent implements OnChanges {

  @Input() data: any[];

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
          shadow: false,
          center: ['50%', '50%']
        }
      },
      series: [{
        name: 'categories',
        size: '60%',
        data: [],
        dataLabels: {
          formatter: function () {
            return this.y > 5 ? this.point.name : null;
          },
          color: '#000000',
          distance: -30
        }
      }, {
        name: 'labels',
        size: '80%',
        innerSize: '60%',
        data: []
      }]
    };

    const groupedDetails = CommonFunctions.consolidateDetails(data);
    let categories = [];
    const series = [];
    for (const group of groupedDetails) {
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
          data: details.amount
        })
      }
    }
    options.series[0].data = categories;
    options.series[1].data = series;
    return options;
  }

}
