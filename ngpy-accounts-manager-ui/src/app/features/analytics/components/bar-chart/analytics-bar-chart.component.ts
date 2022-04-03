import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonFunctions } from '@shared/utils/common-functions';
import { CompositeKeyValue } from '@core/models/api.models';
import { ToCategoryPipe } from '@shared/pipes/to-category.pipe';
import { ToLabelPipe } from '@shared/pipes/to-label.pipe';
import { Options, SeriesColumnOptions } from 'highcharts';

@Component({
  selector: 'app-analytics-bar-chart',
  templateUrl: './analytics-bar-chart.component.html',
  styleUrls: ['./analytics-bar-chart.component.scss']
})
export class AnalyticsBarChartComponent implements OnChanges {

  @Input() chartTitle?: string;
  @Input() data?: CompositeKeyValue[];
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
  private buildChartOptions(data: CompositeKeyValue[]): Options {
    const that = this;
    const categories = this.buildChartCategories(data);
    const series = this.buildChartSeries(data, categories);
    return {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter(): string {
          return '<b>' + that.resolveName(this.series.name) + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + that.decimalPipe.transform(this.percentage, '1.2-2') + '%)';
        }
      },
      legend: {
        labelFormatter(): string {
          return that.resolveName(this.name);
        }
      },
      xAxis: {
        categories
      },
      yAxis: {
        stackLabels: {
          enabled: true,
          formatter(): string {
            return that.decimalPipe.transform(this.total, '1.2-2') + ' €';
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            formatter(): string {
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series
    };
  }

  private buildChartCategories(values: CompositeKeyValue[]): string[] {
    // Generating list of categories
    const categories: string[] = [];
    for (const d of values) {
      if (!categories.includes(d.keyOne)) {
        categories.push(d.keyOne);
      }
    }
    return categories.sort((a: string, b: string) => {
      return a.localeCompare(b);
    });
  }

  private buildChartSeries(values: CompositeKeyValue[], categories: string[]): SeriesColumnOptions[] {
    const groupedValues: any = {};
    for (const d of values) {
      const categoryIdx = categories.indexOf(d.keyOne);
      if (!groupedValues.hasOwnProperty(d.keyTwo)) {
        groupedValues[d.keyTwo] = [];
      }
      CommonFunctions.resizeArray(groupedValues[d.keyTwo], 0, categoryIdx);
      groupedValues[d.keyTwo][categoryIdx] = {
        y: d.value
      };
    }

    const series: SeriesColumnOptions[] = [];
    for (const key in groupedValues) {
      if (groupedValues.hasOwnProperty(key)) {
        series.push({
          type: 'column',
          name: key,
          data: groupedValues[key],
          color: this.resolveColor(key)
        });
      }
    }
    return series;
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

  /**
   * Resolves the color by the id.
   *
   * @param id the id to resolve
   */
  private resolveColor(id: string): string {
    if (this.byCategories) {
      return this.toCategoryPipe.transform(+id, 'color');
    }
    return this.toLabelPipe.transform(+id, 'color');
  }

}
