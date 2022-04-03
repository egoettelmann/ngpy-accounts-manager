import { Component, Input, OnInit } from '@angular/core';
import { Account, Summary } from '@core/models/api.models';

/**
 * The total summary interface
 */
declare interface TotalSummary {
  total: number;
  performance: number;
}

/**
 * The account card component
 */
@Component({
  selector: 'app-dashboard-total-summary',
  templateUrl: './dashboard-total-summary.component.html',
  styleUrls: ['./dashboard-total-summary.component.scss']
})
export class DashboardTotalSummaryComponent implements OnInit {

  /**
   * The list of accounts
   */
  @Input() accounts?: Account[];

  /**
   * The rolling month summary
   */
  @Input() rollingMonthSummary?: Summary;

  /**
   * The rolling three months summary
   */
  @Input() rollingThreeMonthsSummary?: Summary;

  /**
   * The rolling year summary
   */
  @Input() rollingYearSummary?: Summary;

  /**
   * The total of all accounts
   */
  total?: number;

  /**
   * The summaries
   */
  summaries?: {
    month: TotalSummary,
    threeMonths: TotalSummary,
    year: TotalSummary
  };

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.total = this.calculateTotal();
    this.summaries = {
      month: this.calculateSummary(this.rollingMonthSummary),
      threeMonths: this.calculateSummary(this.rollingThreeMonthsSummary),
      year: this.calculateSummary(this.rollingYearSummary)
    };
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
   * Calculates the total of all accounts
   */
  private calculateTotal(): number {
    let total = 0;
    if (this.accounts == null) {
      return total;
    }

    for (const a of this.accounts) {
      total += a.total;
    }
    return total;
  }

  /**
   * Calculates the total and the performance for a given summary.
   *
   * @param summary the total summary
   */
  private calculateSummary(summary?: Summary): TotalSummary {
    if (summary == null) {
      return {
        total: 0,
        performance: 0
      };
    }

    return {
      total: summary.totalDebit + summary.totalCredit,
      performance: (summary.amountEnd / summary.amountStart - 1) * 100
    };
  }

}
