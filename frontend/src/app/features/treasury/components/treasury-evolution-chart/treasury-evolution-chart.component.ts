import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KeyValue } from '../../../../core/models/api.models';

@Component({
  selector: 'app-treasury-evolution-chart',
  templateUrl: './treasury-evolution-chart.component.html',
  styleUrls: ['./treasury-evolution-chart.component.scss']
})
export class TreasuryEvolutionChartComponent implements OnChanges {

  @Input() evolutionData: KeyValue[];
  @Input() aggregationData: KeyValue[];
  @Input() chartTitle: string;

  public chartOptions: any;

  constructor(private decimalPipe: DecimalPipe) {
  }

  /**
   * Triggered chen the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.evolutionData || changes.aggregationData) && this.evolutionData && this.aggregationData) {
      this.chartOptions = this.buildChartOptions(this.evolutionData, this.aggregationData);
    }
  }

  /**
   * Builds the chart options for HighCharts.
   *
   * @param evolution the graph data for the evolution part
   * @param aggregation the graph data for the aggregation part
   * @returns the chart options
   */
  private buildChartOptions(evolution: KeyValue[], aggregation: KeyValue[]) {
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
        type: 'column',
        data: [],
        showInLegend: false
      }, {
        data: [],
        showInLegend: false
      }]
    };
    evolution.forEach(eItem => {
      options.xAxis.categories.push(eItem.key);
      options.series[1].data.push(eItem.value);

      aggregation.forEach(aItem => {
        if (aItem.key === eItem.key) {
          options.series[0].data.push(aItem.value);
        }
      });
      if (options.series[1].data.length > options.series[0].data.length) {
        options.series[0].data.push(0);
      }
    });
    return options;
  }

}
