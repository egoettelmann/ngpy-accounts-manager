import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BudgetStatus } from '@core/models/api.models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Options, PointOptionsObject, SeriesColumnOptions } from 'highcharts';

@Component({
  selector: 'app-budget-history-chart',
  templateUrl: './budget-history-chart.component.html',
  styleUrls: ['./budget-history-chart.component.scss']
})
export class BudgetHistoryChartComponent implements OnChanges {

  @Input() chartTitle?: string;
  @Input() data?: BudgetStatus[];

  public chartOptions: any;

  /**
   * Instantiates the component.
   *
   * @param router the router
   * @param decimalPipe the decimal pipe
   * @param translateService the translate service
   */
  constructor(
    private router: Router,
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
        type: 'column'
      },
      tooltip: {
        formatter(): string {
          return '<b>' + this.series.name + '</b><br/>'
            + '<b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>'
            + ' (' + this.point.options.custom?.relativeRatio + ')';
        }
      },
      xAxis: {
        categories
      },
      yAxis: {
        labels: {
          enabled: false
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter(): string {
              if (this.y === 0) {
                return '';
              }
              return that.decimalPipe.transform(this.y, '1.2-2') + ' €';
            }
          }
        }
      },
      series
    };
  }

  private buildChartSeries(values: BudgetStatus[]): [string[], SeriesColumnOptions[]] {
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
        type: 'column',
        name: this.translateService.instant('i18n.components.budgets.series.overrun'),
        data: overrun,
        color: '#f45b5b'
      }, {
        type: 'column',
        name: this.translateService.instant('i18n.components.budgets.series.available'),
        data: available,
        color: '#90ed7d'
      }, {
        type: 'column',
        name: this.translateService.instant('i18n.components.budgets.series.consumption'),
        data: consumption,
        color: '#7cb5ec'
      }]
    ];
  }
}
