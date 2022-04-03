import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Label, Transaction } from '@core/models/api.models';

/**
 * The transactions table component
 */
@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent {

  /**
   * The list of transactions
   */
  @Input() transactions?: Transaction[];

  /**
   * The list of labels
   */
  @Input() labels?: Label[];

  /**
   * If the transactions are editable or not
   */
  @Input() editable = false;

  /**
   * Triggered when a transaction gets modified
   */
  @Output() onChange = new EventEmitter<Transaction>();

  /**
   * Triggered when a transaction gets deleted.
   */
  @Output() onDelete = new EventEmitter<Transaction>();

  /**
   * The reference to the action buttons
   */
  @ContentChild('actionButtons', { static: false }) actionButtons?: TemplateRef<any>;

  /**
   * Changes the label of the provided transaction.
   *
   * @param label the new label
   * @param transaction the transaction to change
   */
  changeLabel(label: Label, transaction: Transaction): void {
    if (label
      && transaction
      && transaction.label
      && label.id !== undefined
      && label.id !== transaction.label.id) {
      const newTransaction = Object.assign({}, transaction, { label_id: label.id });
      this.onChange.emit(newTransaction);
    }
  }

  /**
   * Adds a new label to a transaction.
   *
   * @param labelString the label to create
   * @param transaction the transaction to modify
   */
  addLabel(labelString: string, transaction: Transaction): void {
    if (transaction) {
      console.log('Add new label', labelString);
    }
  }

  /**
   * Gets the CSS class for the provided amount.
   *
   * @param amount the amount
   */
  getAmountColor(amount?: number): string {
    if (amount == null) {
      return '';
    }
    return amount < 0 ? 'text-danger' : 'text-success';
  }

}
