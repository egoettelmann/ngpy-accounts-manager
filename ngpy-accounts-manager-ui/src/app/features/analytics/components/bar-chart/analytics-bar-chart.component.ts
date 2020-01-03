import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonFunctions } from '../../../../shared/utils/common-functions';
import { CompositeKeyValue } from '../../../../core/models/api.models';
import { ToCategoryPipe } from '../../../../shared/pipes/to-category.pipe';
import { ToLabelPipe } from '../../../../shared/pipes/to-label.pipe';

@Component({
  selector: 'app-analytics-bar-chart',
  templateUrl: './analytics-bar-chart.component.html',
  styleUrls: ['./analytics-bar-chart.component.scss']
})
export class AnalyticsBarChartComponent implements OnChanges {

  @Input() chartTitle: string;
  @Input() data: CompositeKeyValue[];
  @Input() byCategories = true;

  public chartOptions: any;

  constructor(private decimalPipe: DecimalPipe,
              private toCategoryPipe: ToCategoryPipe,
              private toLabelPipe: ToLabelPipe
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
  private buildChartOptions(data: CompositeKeyValue[]) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function() {
          return '<b>' + that.resolveName(this.series.name) + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      legend: {
        labelFormatter: function() {
          return that.resolveName(this.name);
        }
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        stackLabels: {
          enabled: true,
          formatter: function() {
            return that.decimalPipe.transform(this.total, '1.2-2') + ' €';
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            formatter: function() {
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series: []
    };
    let categories = [];
    const series = {};

    // Generating list of categories
    for (const d of data) {
      if (!categories.includes(d.keyOne)) {
        categories.push(d.keyOne);
      }
    }
    categories = categories.sort((a: string, b: string) => {
      return a.localeCompare(b);
    });
    for (const d of data) {
      const categoryIdx = categories.indexOf(d.keyOne);
      if (!series.hasOwnProperty(d.keyTwo)) {
        series[d.keyTwo] = [];
      }
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

  /**
   * Resolves the name by the id.
   *
   * @param id the id to resolve
   */
  private resolveName(id: string): string {
    if (this.byCategories) {
      return this.toCategoryPipe.transform(+id, 'name');
    }
    return this.toLabelPipe.transform(+id, 'name');
  }

}
