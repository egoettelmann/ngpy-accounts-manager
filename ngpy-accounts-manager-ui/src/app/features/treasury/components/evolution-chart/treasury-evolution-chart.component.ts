import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KeyValue } from '../../../../core/models/api.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-treasury-evolution-chart',
  templateUrl: './treasury-evolution-chart.component.html',
  styleUrls: ['./treasury-evolution-chart.component.scss']
})
export class TreasuryEvolutionChartComponent implements OnChanges {

  @Input() evolutionData: KeyValue[];
  @Input() aggregationCreditData: KeyValue[];
  @Input() aggregationDebitData: KeyValue[];
  @Input() chartTitle: string;

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
  private buildChartOptions(evolution: KeyValue[], aggregationCredit: KeyValue[], aggregationDebit: KeyValue[]) {
    const that = this;
    const options = {
      tooltip: {
        formatter: function () {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories: []
      },
      series: [{
        name: this.translateService.instant('i18n.views.treasury.chart.credits'),
        type: 'column',
        data: [],
        stacking: 'normal',
        color: '#90ed7d'
      }, {
        name: this.translateService.instant('i18n.views.treasury.chart.debits'),
        type: 'column',
        data: [],
        stacking: 'normal',
        color: '#f45b5b'
      }, {
        name: this.translateService.instant('i18n.views.treasury.chart.evolution'),
        data: [],
        color: '#434348'
      }]
    };
    evolution.forEach(eItem => {
      options.xAxis.categories.push(eItem.key);
      options.series[2].data.push(eItem.value);

      aggregationCredit.forEach(aItem => {
        if (aItem.key === eItem.key) {
          options.series[0].data.push(aItem.value);
        }
      });
      aggregationDebit.forEach(aItem => {
        if (aItem.key === eItem.key) {
          options.series[1].data.push(aItem.value);
        }
      });
      if (options.series[2].data.length > options.series[0].data.length) {
        options.series[0].data.push(0);
      }
      if (options.series[2].data.length > options.series[1].data.length) {
        options.series[1].data.push(0);
      }
    });
    return options;
  }

}
