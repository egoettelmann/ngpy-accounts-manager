import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartSerie } from '@core/models/domain.models';
import { CompositeKeyValue } from '@core/models/api.models';
import { CommonFunctions } from '@shared/utils/common-functions';

@Component({
  selector: 'app-analytics-movements-table',
  templateUrl: './analytics-movements-table.component.html',
  styleUrls: ['./analytics-movements-table.component.scss']
})
export class AnalyticsMovementsTableComponent implements OnChanges {

  @Input() movements?: CompositeKeyValue[];
  @Input() quarterly?: boolean;

  tableMovements?: ChartSerie[];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.movements && !changes.quarterly) {
      return;
    }
    if (this.movements) {
      this.tableMovements = this.buildTable(this.movements);
    }
  }

  /**
   * Builds the aggregation table.
   *
   * @param data the data to aggregate
   * @returns the aggregated data for the table
   */
  private buildTable(data: CompositeKeyValue[]): ChartSerie[] {
    const movements: ChartSerie[] = [];
    let categories: string[] = [];
    const series: any = {};

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
      CommonFunctions.resizeArray(series[d.keyTwo], 0, this.quarterly ? 3 : 11);
      series[d.keyTwo][categoryIdx] = d.value;
    }
    for (const key in series) {
      if (series.hasOwnProperty(key)) {
        movements.push({
          name: key,
          data: series[key]
        });
      }
    }
    return movements;
  }

}
