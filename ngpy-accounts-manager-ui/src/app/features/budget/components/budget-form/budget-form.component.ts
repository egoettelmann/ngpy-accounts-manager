import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account, Budget, Label } from '../../../../core/models/api.models';

/**
 * The budget form component
 */
@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html'
})
export class BudgetFormComponent implements OnChanges {

  /**
   * The transaction
   */
  @Input() model: Budget;

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
  @Output() onFormSubmit = new EventEmitter<Budget>();

  /**
   * Triggered on delete
   */
  @Output() onFormDelete = new EventEmitter<Budget>();

  /**
   * Triggered on cancel
   */
  @Output() onFormCancel = new EventEmitter<Budget>();

  /**
   * The form group
   */
  form: FormGroup;

  /**
   * The available periods
   */
  periods = ['DAY', 'MONTH', 'QUARTER', 'YEAR'];

  /**
   * Instantiates the component.
   *
   * @param fb the form builder
   */
  constructor(
    private fb: FormBuilder
  ) {
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
        'name': [null, [Validators.required]],
        'description': [null],
        'period': [null, [Validators.required]],
        'amount': [null, [Validators.required]],
        'accounts': [null],
        'labels': [null]
      }
    );
  }

  selectAccounts(accounts: number[]) {
    if (accounts && accounts.length > 0) {
      this.form.get('accounts').setValue(accounts);
    } else {
      this.form.get('accounts').setValue(null);
    }
  }

  selectLabels(labels: number[]) {
    if (labels && labels.length > 0) {
      this.form.get('labels').setValue(labels);
    } else {
      this.form.get('labels').setValue(null);
    }
  }

  /**
   * Inits the form data.
   *
   * @param data the form data
   */
  initFormData(data: Budget) {
    const t = Object.assign({}, data) as Budget;
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
    const t = Object.assign({}, this.model, this.form.value) as Budget;
    this.onFormSubmit.emit(t);
  }

  /**
   * Deletes the transaction
   */
  deleteBudget() {
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
