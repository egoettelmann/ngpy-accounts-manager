import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BudgetStatus } from '@core/models/api.models';
import { TranslateService } from '@ngx-translate/core';
import { Options, PointOptionsObject, SeriesBarOptions } from 'highcharts';

@Component({
  selector: 'app-budget-chart',
  templateUrl: './budget-chart.component.html',
  styleUrls: ['./budget-chart.component.scss']
})
export class BudgetChartComponent implements OnChanges {

  @Input() chartTitle?: string;
  @Input() data?: BudgetStatus[];

  @Output() handleClick = new EventEmitter<number>();

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
  private buildChartOptions(data: BudgetStatus[]): Options {
    const that = this;
    const [categories, series] = this.buildChartSeries(data);
    return {
      chart: {
        type: 'bar',
        height: data.length * 50 + 62
      },
      tooltip: {
        formatter(): string {
          return '<b>' + this.series.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + this.point.options.custom?.relativeRatio + ')';
        }
      },
      legend: {
        verticalAlign: 'top'
      },
      xAxis: {
        categories,
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
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            formatter(): string {
              if (this.y === 0) {
                return '';
              }
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          },
          cursor: 'pointer',
          point: {
            events: {
              click(): void {
                that.handleClick.emit(this.options.custom?.budgetId);
              }
            }
          }
        }
      },
      series
    };
  }

  private buildChartSeries(values: BudgetStatus[]): [string[], SeriesBarOptions[]] {
    const categories: string[] = [];
    const consumption: PointOptionsObject[] = [];
    const overrun: PointOptionsObject[] = [];
    const available: PointOptionsObject[] = [];

    // Generating list of categories
    for (const d of values) {
      if (d.budget == null || d.budget.name == null || d.budget.amount == null) {
        continue;
      }
      if (!categories.includes(d.budget.name)) {
        categories.push(d.budget.name);
      }
      const categoryIdx = categories.length - 1;
      const totalSpending = Math.abs(d.spending);
      const totalBudget = d.budget.amount;
      if (totalSpending > totalBudget) {
        // Spending are exceeding budget
        consumption[categoryIdx] = {
          y: totalBudget,
          custom: {
            relativeRatio: this.decimalPipe.transform(100, '1.2-2') + '%',
            budgetId: d.budget.id
          }
        };
        const aboveRatio = (totalSpending / totalBudget) - 1;
        overrun[categoryIdx] = {
          y: totalSpending - totalBudget,
          custom: {
            relativeRatio: '+' + this.decimalPipe.transform(aboveRatio * 100, '1.2-2') + '%',
            budgetId: d.budget.id
          }
        };
        available[categoryIdx] = {
          y: 0
        };
        continue;
      }

      // Spending below budget
      const budgetRatio = totalSpending / totalBudget;
      consumption[categoryIdx] = {
        y: totalSpending,
        custom: {
          relativeRatio: this.decimalPipe.transform(budgetRatio * 100, '1.2-2') + '%',
          budgetId: d.budget.id
        }
      };
      const belowRatio = (totalBudget - totalSpending) / totalBudget;
      available[categoryIdx] = {
        y: totalBudget - totalSpending,
        custom: {
          relativeRatio: this.decimalPipe.transform(belowRatio * 100, '1.2-2') + '%',
          budgetId: d.budget.id
        }
      };
      overrun[categoryIdx] = {
        y: 0
      };
    }

    return [
      categories,
      [{
        type: 'bar',
        pointWidth: 40,
        name: this.translateService.instant('i18n.components.budgets.series.overrun'),
        data: overrun,
        color: '#f45b5b'
      }, {
        type: 'bar',
        pointWidth: 40,
        name: this.translateService.instant('i18n.components.budgets.series.available'),
        data: available,
        color: '#90ed7d'
      }, {
        type: 'bar',
        pointWidth: 40,
        name: this.translateService.instant('i18n.components.budgets.series.consumption'),
        data: consumption,
        color: '#7cb5ec'
      }]
    ];
  }

}
