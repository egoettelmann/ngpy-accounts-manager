import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html'
})
export class TransactionsFormComponent {

  @Input() buttonLabel = 'i18n.transactions.form.button.add';

  form: FormGroup;

  constructor() {
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

  getFormControls() {
    return Object.keys(this.form.controls);
  }

  saveTransaction() {
    console.log('submit');
  }

}
