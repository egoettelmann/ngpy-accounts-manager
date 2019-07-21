import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Label, Transaction } from '../../../../core/models/api.models';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent {

  @Input() transactions: Transaction[];
  @Input() labels: Label[];
  @Input() editable = false;

  @Output() onChange = new EventEmitter<Transaction>();
  @Output() onDelete = new EventEmitter<Transaction>();

  @ContentChild('actionButtons')
  actionButtons: TemplateRef<any>;

  changeLabel(label: Label, transaction: Transaction) {
    if (label
      && transaction
      && transaction.label
      && label.id !== undefined
      && label.id !== transaction.label.id) {
      const newTransaction = Object.assign({}, transaction, { label_id: label.id });
      this.onChange.emit(newTransaction);
    }
  }

  addLabel(labelString: string, transaction: Transaction) {
    if (transaction) {
      console.log('Add new label', labelString);
    }
  }

  getAmountColor(amount: number): string {
    return amount < 0 ? 'text-danger' : 'text-success';
  }

}
