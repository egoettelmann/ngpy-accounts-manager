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
        'id': [null],
        'name': [null, [Validators.required]],
        'description': [null],
        'period': [null, [Validators.required]],
        'amount': [null, [Validators.required]],
        'accounts': [null],
        'labels': [null]
      }
    );
  }

  /**
   * Select multiple accounts.
   *
   * @param accounts the account ids to select
   */
  selectAccounts(accounts: number[]) {
    if (accounts && accounts.length > 0) {
      this.form.get('accounts').setValue(accounts);
    } else {
      this.form.get('accounts').setValue(null);
    }
  }

  /**
   * Select multiple labels.
   *
   * @param labels the label ids to select
   */
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
    const t = Object.assign({}, data) as any;
    t.accounts = t.accounts.map(account => account.id);
    t.labels = t.labels.map(label => label.id);
    this.form.patchValue(t);
  }

  /**
   * Submits the form
   */
  submitForm() {
    const t = Object.assign({}, this.form.value) as any;
    if (t.accounts != null) {
      t.accounts = t.accounts.map(id => this.findAccountFromId(id));
    } else {
      t.accounts = [];
    }
    if (t.labels != null) {
      t.labels = t.labels.map(id => this.findLabelFromId(id));
    } else {
      t.labels = [];
    }
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

  /**
   * Finds an account by its id.
   *
   * @param accountId the account id to find
   */
  private findAccountFromId(accountId: number): Account {
    return this.accounts.find(account => account.id === accountId);
  }

  /**
   * Finds a label by its id.
   *
   * @param labelId the label id to find
   */
  private findLabelFromId(labelId: number): Label {
    return this.labels.find(label => label.id === labelId);
  }

}
