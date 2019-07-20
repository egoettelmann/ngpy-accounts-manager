import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../../../core/models/transaction';
import { Label } from '../../../../core/models/label';
import { Account } from '../../../../core/models/account';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html'
})
export class TransactionsFormComponent implements OnChanges {

  @Input() model: Transaction;
  @Input() labels: Label[];
  @Input() accounts: Account[];

  @Output() onFormSubmit = new EventEmitter<Transaction>();
  @Output() onFormDelete = new EventEmitter<Transaction>();
  @Output() onFormCancel = new EventEmitter<Transaction>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model && this.model) {
      this.buildForm();
      this.initFormData(this.model);
    }
  }

  buildForm() {
    this.form = this.fb.group(
      {
        'account_id': [null, [Validators.required]],
        'reference': [null, [Validators.required]],
        'description': [null],
        'dateValue': [null, [Validators.required]],
        'amount': [null, [Validators.required]],
        'label_id': [null]
      }
    );
  }

  initFormData(data: Transaction) {
    this.form.patchValue(data);
  }

  changeLabel(label: Label) {
    this.form.patchValue({ 'label_id': label.id });
  }

  submitForm() {
    const t = Object.assign({}, this.model, this.form.value);
    this.onFormSubmit.emit(t);
  }

  deleteTransaction() {
    const t = Object.assign({}, this.model);
    this.onFormDelete.emit(t);
  }

  cancel() {
    const t = Object.assign({}, this.model);
    this.onFormCancel.emit(t);
  }

}
