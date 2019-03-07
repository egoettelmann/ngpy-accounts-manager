import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Summary} from '../../../../core/models/summary';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnChanges {

  @Input() summary: Summary;
  public result: number;
  public performance: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.summary != null && this.summary) {
      this.result = this.summary.totalDebit + this.summary.totalCredit;
      this.performance = (this.summary.amountEnd / this.summary.amountStart - 1) * 100;
    }
  }

  getAmountColor(amount: number): string {
    return amount < 0 ? 'text-danger' : 'text-success';
  }
}
