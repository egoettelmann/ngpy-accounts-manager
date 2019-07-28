import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonFunctions } from '../../../../shared/utils/common-functions';
import { CompositeKeyValue } from '../../../../core/models/api.models';

@Component({
  selector: 'app-analytics-quarterly-chart',
  templateUrl: './analytics-quarterly-chart.component.html',
  styleUrls: ['./analytics-quarterly-chart.component.scss']
})
export class AnalyticsQuarterlyChartComponent implements OnChanges {

  @Input() chartTitle: string;
  @Input() data: CompositeKeyValue[];
  @Input() prefix: string = '';

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
  private buildChartOptions(data: CompositeKeyValue[]) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        stackLabels: {
          enabled: true,
          formatter: function () {
            return that.decimalPipe.transform(this.total, '1.2-2') + ' €';
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            formatter: function () {
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series: []
    };
    let categories = [];
    const series = {};
    for (const d of data) {
      const categoryIdx = parseInt(d.keyOne, 10) - 1;
      CommonFunctions.resizeArray(categories, 0, categoryIdx);
      categories[categoryIdx] = this.prefix + d.keyOne;
      if (!series.hasOwnProperty(d.keyTwo)) {
        series[d.keyTwo] = [];
      }
      categories = categories.map((value, idx) => {
        if (value === 0) {
          return this.prefix + (idx + 1);
        }
        return value;
      });
      CommonFunctions.resizeArray(series[d.keyTwo], 0, categoryIdx);
      series[d.keyTwo][categoryIdx] = d.value;
    }
    options.xAxis.categories = categories;
    for (const key in series) {
      if (series.hasOwnProperty(key)) {
        options.series.push({
          name: key,
          data: series[key]
        });
      }
    }
    return options;
  }

}
