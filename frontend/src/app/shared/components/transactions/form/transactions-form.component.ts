import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account, Label, Transaction } from '../../../../core/models/api.models';

/**
 * The transactions form component
 */
@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html'
})
export class TransactionsFormComponent implements OnChanges {

  /**
   * The transaction
   */
  @Input() model: Transaction;

  /**
   * the available labels
   */
  @Input() labels: Label[];

  /**
   * The available accounts
   */
  @Input() accounts: Account[];

  /**
   * Triggered when the form is submitted
   */
  @Output() onFormSubmit = new EventEmitter<Transaction>();

  /**
   * Triggered on delete
   */
  @Output() onFormDelete = new EventEmitter<Transaction>();

  /**
   * Triggered on cancel
   */
  @Output() onFormCancel = new EventEmitter<Transaction>();

  /**
   * The form group
   */
  form: FormGroup;

  /**
   * Instantiates the component.
   *
   * @param fb the form builder
   */
  constructor(private fb: FormBuilder) {
  }

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model && this.model) {
      this.buildForm();
      this.initFormData(this.model);
    }
  }

  /**
   * Builds the form
   */
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

  /**
   * Inits the form data.
   *
   * @param data the form data
   */
  initFormData(data: Transaction) {
    this.form.patchValue(data);
  }

  /**
   * Changes the label.
   *
   * @param label the new label
   */
  changeLabel(label: Label) {
    this.form.patchValue({ 'label_id': label.id });
  }

  /**
   * Submits the form
   */
  submitForm() {
    const t = Object.assign({}, this.model, this.form.value);
    this.onFormSubmit.emit(t);
  }

  /**
   * Deletes the transaction
   */
  deleteTransaction() {
    const t = Object.assign({}, this.model);
    this.onFormDelete.emit(t);
  }

  /**
   * Cancels
   */
  cancel() {
    const t = Object.assign({}, this.model);
    this.onFormCancel.emit(t);
  }

}
