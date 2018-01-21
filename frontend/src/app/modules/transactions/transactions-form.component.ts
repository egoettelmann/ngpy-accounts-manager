import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Transaction } from './transaction';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html'
})
export class TransactionsFormComponent implements OnChanges {

  @Input() buttonLabel = 'i18n.transactions.form.button.add';
  @Input() buttonDeleteLabel = 'i18n.transactions.form.button.delete';
  @Input() model: Transaction;

  @Output() onFormSubmit = new EventEmitter<Transaction>();
  @Output() onFormDelete = new EventEmitter<Transaction>();

  form: FormGroup;

  constructor() {
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup(
      {
        reference: new FormControl(
          null,
          Validators.required
        ),
        description: new FormControl(null),
        dateValue: new FormControl(
          null,
          Validators.required
        ),
        amount: new FormControl(
          null,
          Validators.required
        )
      }
    );
  }

  initFormData(data: any) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model && this.model) {
      this.initFormData(this.model);
    }
  }

  getFormControls() {
    return Object.keys(this.form.controls);
  }

  submitForm() {
    const t = Object.assign({}, this.model, this.form.value);
    this.onFormSubmit.emit(t);
  }

  deleteTransaction() {
    const t = Object.assign({}, this.model);
    this.onFormDelete.emit(t);
  }

}
