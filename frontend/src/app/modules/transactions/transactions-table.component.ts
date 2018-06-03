import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PatchEvent, Transaction } from './transaction';
import { Label } from './label';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent implements OnChanges, OnInit {

  @Input() transactions: Transaction[];
  @Input() labels: Label[];
  @Input() editable = false;

  @Output() onChange = new EventEmitter<PatchEvent<Transaction>>();
  @Output() onDelete = new EventEmitter<Transaction>();

  selectedTransaction: Transaction;
  showModal = false;

  ngOnInit(): void {}

  ngOnChanges(changes) {}

  select(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  changeLabel(label: Label, transaction: Transaction) {
    if (label
      && transaction
      && transaction.label
      && label.id !== undefined
      && label.id !== transaction.label.id) {
      this.onChange.emit(new PatchEvent(transaction, { label_id: label.id }));
    }
  }

  addLabel(labelString: string, transaction: Transaction) {
    if (transaction) {
      console.log('Add new label', labelString);
    }
  }

  changeTransaction(transaction: Transaction) {
    this.onChange.emit(new PatchEvent(transaction, transaction));
  }

  deleteTransaction(transaction: Transaction) {
    this.onDelete.emit(transaction);
  }

}
