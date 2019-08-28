import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BudgetStatus } from '../../../../core/models/api.models';
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

  /**
   * Instantiates the component.
   *
   * @param decimalPipe the decimal pipe
   * @param translateService the translate service
   */
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
    const categories = [];
    const series = {
      consumption: [],
      overrun: [],
      available: []
    };

    // Generating list of categories
    for (const d of data) {
      if (!categories.includes(d.budget.name)) {
        categories.push(d.budget.name);
      }
      const categoryIdx = categories.length - 1;
      const totalSpending = Math.abs(d.spending);
      const totalBudget = d.budget.amount;
      if (totalSpending > totalBudget) {
        series.consumption[categoryIdx] = {
          y: totalBudget,
          relativeRatio: this.decimalPipe.transform(100, '1.2-2') + '%'
        };
        const aboveRatio = (totalSpending / totalBudget) - 1;
        series.overrun[categoryIdx] = {
          y: totalSpending - totalBudget,
          relativeRatio: '+' + this.decimalPipe.transform(aboveRatio * 100, '1.2-2') + '%'
        };
        series.available[categoryIdx] = {
          y: 0
        };
      } else {
        const budgetRatio = totalSpending / totalBudget;
        series.consumption[categoryIdx] = {
          y: totalSpending,
          relativeRatio: this.decimalPipe.transform(budgetRatio * 100, '1.2-2') + '%'
        };
        const belowRatio = (totalBudget - totalSpending) / totalBudget;
        series.available[categoryIdx] = {
          y: totalBudget - totalSpending,
          relativeRatio: this.decimalPipe.transform(belowRatio * 100, '1.2-2') + '%'
        };
        series.overrun[categoryIdx] = {
          y: 0
        };
      }
    }
    options.xAxis.categories = categories;
    options.series = [{
      name: this.translateService.instant('i18n.component.budget.series.overrun'),
      data: series.overrun,
      color: '#f45b5b'
    }, {
      name: this.translateService.instant('i18n.component.budget.series.available'),
      data: series.available,
      color: '#90ed7d'
    }, {
      name: this.translateService.instant('i18n.component.budget.series.consumption'),
      data: series.consumption,
      color: '#7cb5ec'
    }];
    return options;
  }

}
