import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account, Label, Transaction } from '../../../../core/models/api.models';
import { DateService } from '../../../../core/services/date.service';

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
   * @param dateService the date service
   */
  constructor(
    private fb: FormBuilder,
    private dateService: DateService
  ) {}

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
        'note': [null],
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
    const t = Object.assign({}, data) as Transaction;
    t.dateValue = this.dateService.parse(t.dateValue) as any;
    this.form.patchValue(t);
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
   * Changes the date.
   *
   * @param value the new date
   */
  changeDate(value: Date) {
    this.form.get('dateValue').setValue(value);
  }

  /**
   * Submits the form
   */
  submitForm() {
    const t = Object.assign({}, this.model, this.form.value) as Transaction;
    t.dateValue = this.dateService.format(t.dateValue as any);
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
