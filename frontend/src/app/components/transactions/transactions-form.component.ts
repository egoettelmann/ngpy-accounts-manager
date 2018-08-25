import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction } from './transaction';
import { Label } from './label';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html'
})
export class TransactionsFormComponent implements OnChanges {

  @Input() model: Transaction;

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
        'reference': [null, [Validators.required]],
        'description': [null],
        'dateValue': [null, [Validators.required]],
        'amount': [null, [Validators.required]]
      }
    );
  }

  initFormData(data: Transaction) {
    this.form.patchValue(data);
    this.form.patchValue({ 'label_id': data.label.id });
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
