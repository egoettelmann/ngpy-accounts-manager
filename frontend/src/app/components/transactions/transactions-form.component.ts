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
  @Input() labels: Label[];

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
        'amount': [null, [Validators.required]],
        'label_id': [null]
      }
    );
  }

  initFormData(data: Transaction) {
    this.form.patchValue(data);
    if (data.label != null) {
      this.form.patchValue({ 'label_id': data.label.id });
    }
  }

  changeLabel(label: Label) {
    console.log('changeLabel', label);
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
