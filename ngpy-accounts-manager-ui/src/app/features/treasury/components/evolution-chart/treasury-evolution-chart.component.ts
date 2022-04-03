import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KeyValue } from '@core/models/api.models';
import { TranslateService } from '@ngx-translate/core';
import { Options, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

@Component({
  selector: 'app-treasury-evolution-chart',
  templateUrl: './treasury-evolution-chart.component.html',
  styleUrls: ['./treasury-evolution-chart.component.scss']
})
export class TreasuryEvolutionChartComponent implements OnChanges {

  @Input() evolutionData?: KeyValue[];
  @Input() aggregationCreditData?: KeyValue[];
  @Input() aggregationDebitData?: KeyValue[];
  @Input() chartTitle?: string;

  public chartOptions: any;

  constructor(private translateService: TranslateService,
              private decimalPipe: DecimalPipe
  ) {
  }

  /**
   * Triggered chen the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.evolutionData || changes.aggregationCreditData || changes.aggregationDebitData)
      && this.evolutionData && this.aggregationCreditData && this.aggregationDebitData
    ) {
      this.chartOptions = this.buildChartOptions(this.evolutionData, this.aggregationCreditData, this.aggregationDebitData);
    }
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param evolution the graph data for the evolution part
   * @param aggregationCredit the graph data for the aggregation part (credit)
   * @param aggregationDebit the graph data for the aggregation part (debit)
   * @returns the chart options
   */
  private buildChartOptions(evolution: KeyValue[], aggregationCredit: KeyValue[], aggregationDebit: KeyValue[]): Options {
    const that = this;
    const [categories, credits, debits, lines] = this.buildChartSeries(evolution, aggregationCredit, aggregationDebit);
    return {
      tooltip: {
        formatter(): string {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories
      },
      series: [
        credits,
        debits,
        lines
      ]
    };
  }

  private buildChartSeries(
    evolution: KeyValue[],
    aggregationCredit: KeyValue[],
    aggregationDebit: KeyValue[]
  ): [string[], SeriesColumnOptions, SeriesColumnOptions, SeriesLineOptions] {
    const categories: string[] = [];
    const creditSeries: number[] = [];
    const debitSeries: number[] = [];
    const evolutionSeries: number[] = [];
    evolution.forEach(eItem => {
      categories.push(eItem.key);
      evolutionSeries.push(eItem.value);

      aggregationCredit.forEach(aItem => {
        if (aItem.key === eItem.key) {
          creditSeries.push(aItem.value);
        }
      });
      aggregationDebit.forEach(aItem => {
        if (aItem.key === eItem.key) {
          debitSeries.push(aItem.value);
        }
      });
      if (evolutionSeries.length > creditSeries.length) {
        creditSeries.push(0);
      }
      if (evolutionSeries.length > debitSeries.length) {
        debitSeries.push(0);
      }
    });
    return [
      categories,
      {
        name: this.translateService.instant('i18n.views.treasury.chart.credits'),
        type: 'column',
        data: creditSeries,
        stacking: 'normal',
        color: '#90ed7d'
      }, {
        name: this.translateService.instant('i18n.views.treasury.chart.debits'),
        type: 'column',
        data: debitSeries,
        stacking: 'normal',
        color: '#f45b5b'
      }, {
        name: this.translateService.instant('i18n.views.treasury.chart.evolution'),
        type: 'line',
        data: evolutionSeries,
        color: '#434348'
      }
    ];
  }

}
