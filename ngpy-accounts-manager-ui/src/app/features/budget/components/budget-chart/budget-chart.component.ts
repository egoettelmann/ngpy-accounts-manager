import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonFunctions } from '../../../../shared/utils/common-functions';
import { CompositeKeyValue } from '../../../../core/models/api.models';
import { BudgetStatus } from '../../../../core/models/domain.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-budget-chart',
  templateUrl: './budget-chart.component.html',
  styleUrls: ['./budget-chart.component.scss']
})
export class BudgetChartComponent implements OnChanges {

  @Input() chartTitle: string;
  @Input() data: BudgetStatus[];

  public chartOptions: any;

  constructor(
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
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
  private buildChartOptions(data: BudgetStatus[]) {
    const that = this;
    const options = {
      chart: {
        type: 'bar',
        height: this.data.length * 50 + 62
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + this.point.relativeRatio + ')';
        }
      },
      legend: {
        verticalAlign: 'top'
      },
      xAxis: {
        categories: [],
        gridLineWidth: 1
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          enabled: false
        }
      },
      plotOptions: {
        series: {
          pointWidth: '40',
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.y === 0) {
                return;
              }
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series: []
    };
    let categories = [];
    const series = {
      expected: [],
      above: [],
      below: []
    };

    // Generating list of categories
    for (const d of data) {
      if (!categories.includes(d.label)) {
        categories.push(d.label);
      }
    }
    categories = categories.sort((a: string, b: string) => {
      return a.localeCompare(b);
    });
    for (const d of data) {
      const categoryIdx = categories.indexOf(d.label);
      if (d.expected > d.actual) {
        series.expected[categoryIdx] = {
          y: d.actual,
          relativeRatio: this.decimalPipe.transform(d.expectedPercentage * 100, '1.2-2') + '%'
        };
        series.below[categoryIdx] = {
          y: d.expected - d.actual,
          relativeRatio: this.decimalPipe.transform((1 - d.actualPercentage) * 100, '1.2-2') + '%'
        };
        series.above[categoryIdx] = {
          y: 0
        };
      } else {
        series.expected[categoryIdx] = {
          y: d.expected,
          relativeRatio: this.decimalPipe.transform(d.expectedPercentage * 100, '1.2-2') + '%'
        };
        series.above[categoryIdx] = {
          y: d.actual - d.expected,
          relativeRatio: '+' + this.decimalPipe.transform((d.actualPercentage - 1) * 100, '1.2-2') + '%'
        };
        series.below[categoryIdx] = {
          y: 0
        };
      }
    }
    options.xAxis.categories = categories;
    options.series = [{
      name: this.translateService.instant('i18n.component.budget.series.above'),
      data: series.above,
      color: '#f45b5b'
    }, {
      name: this.translateService.instant('i18n.component.budget.series.below'),
      data: series.below,
      color: '#90ed7d'
    }, {
      name: this.translateService.instant('i18n.component.budget.series.expected'),
      data: series.expected,
      color: '#7cb5ec'
    }];
    return options;
  }

}
