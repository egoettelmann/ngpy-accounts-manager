import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Summary } from '@core/models/api.models';

/**
 * The summary component
 */
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnChanges {

  /**
   * The summary to display
   */
  @Input() summary?: Summary;

  /**
   * The calculated result
   */
  public result?: number;

  /**
   * The calculated performance
   */
  public performance?: number;

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.summary != null && this.summary) {
      this.result = this.summary.totalDebit + this.summary.totalCredit;
      this.performance = (this.summary.amountEnd / this.summary.amountStart - 1) * 100;
    }
  }

  /**
   * Gets the class for the amount.
   *
   * @param amount the amount
   */
  getAmountColor(amount: number): string {
    return amount < 0 ? 'text-danger' : 'text-success';
  }
}
