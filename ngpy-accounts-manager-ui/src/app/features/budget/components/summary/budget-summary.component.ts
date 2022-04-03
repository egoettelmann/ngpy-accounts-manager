import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BudgetStatus } from '@core/models/api.models';

/**
 * The budget summary component
 */
@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent implements OnChanges {

  /**
   * The list of budget status
   */
  @Input() statusList?: BudgetStatus[];

  /**
   * The calculated summary
   */
  public summary?: {
    budget: number,
    available: number,
    overrun: number,
    total: number,
  };

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.statusList != null && this.statusList) {
      this.calculateSummary(this.statusList);
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

  /**
   * Calculates the summary.
   *
   * @param statusList the status list
   */
  private calculateSummary(statusList: BudgetStatus[]): void {
    const summary = {
      budget: 0,
      available: 0,
      overrun: 0,
      total: 0,
    };

    statusList.forEach(item => {
      if (item.budget == null || item.budget.amount == null) {
        return;
      }
      summary.budget = summary.budget + item.budget.amount;
      const diff = item.budget.amount - Math.abs(item.spending);
      if (diff > 0) {
        summary.available = summary.available + diff;
      } else {
        summary.overrun = summary.overrun - diff;
      }
      summary.total = summary.total + diff;
    });

    this.summary = summary;
  }

}
