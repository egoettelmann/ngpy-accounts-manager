import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Account } from '../../../../core/models/api.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './settings-accounts.view.html',
  styleUrls: ['./settings-accounts.view.scss']
})
export class SettingsAccountsView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  form: FormGroup;
  formArray: FormArray;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private fb: FormBuilder,
              private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    const sub = this.accountsService.getAccounts().subscribe(accounts => {
      this.buildForm(accounts);
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  deleteAccount(account: Account) {
    this.accountsService.deleteOne(account).subscribe();
  }

  private buildForm(accounts: Account[]) {
    this.form = this.fb.group({
      'accounts': this.fb.array([])
    });
    this.formArray = this.form.get('accounts') as FormArray;
    accounts.map(account => {
      const control = this.buildFormControl(account);
      this.formArray.push(control);
    });
  }

  private buildFormControl(account: Account): FormGroup {
    const formGroup = this.fb.group({
      'id': [account.id],
      'name': [account.name],
      'description': [account.description],
      'color': [account.color],
      'notify': [account.notify],
      'active': [account.active],
      'lastUpdate': [{ value: account.lastUpdate, disabled: true }],
      'total': [{ value: account.total, disabled: true }]
    });

    formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Account) {
    this.accountsService.saveOne(value).subscribe();
  }

}
