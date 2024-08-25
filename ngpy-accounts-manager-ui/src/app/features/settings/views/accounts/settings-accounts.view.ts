import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Account } from '@core/models/api.models';
import { AccountsService } from '@core/services/domain/accounts.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClrIconModule } from '@clr/angular';

@Component({
  standalone: true,
  templateUrl: './settings-accounts.view.html',
  styleUrls: ['./settings-accounts.view.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ClrIconModule
  ]
})
export class SettingsAccountsView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  form?: UntypedFormGroup;
  formArray?: UntypedFormArray;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private fb: UntypedFormBuilder,
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

  deleteAccount(account: Account): void {
    this.accountsService.deleteOne(account).subscribe();
  }

  get accountForms(): UntypedFormGroup[] {
    if (this.formArray == null) {
      return [];
    }
    return this.formArray.controls as UntypedFormGroup[];
  }

  private buildForm(accounts: Account[]): void {
    this.form = this.fb.group({
      accounts: this.fb.array([])
    });
    this.formArray = this.form.get('accounts') as UntypedFormArray;
    accounts.map(account => {
      const control = this.buildFormControl(account);
      this.formArray?.push(control);
    });
  }

  private buildFormControl(account: Account): UntypedFormGroup {
    const formGroup = this.fb.group({
      id: [account.id],
      name: [account.name],
      description: [account.description],
      color: [account.color],
      notify: [account.notify],
      active: [account.active],
      lastUpdate: [{ value: account.lastUpdate, disabled: true }],
      total: [{ value: account.total, disabled: true }]
    });

    formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Account): void {
    this.accountsService.saveOne(value).subscribe();
  }

}
