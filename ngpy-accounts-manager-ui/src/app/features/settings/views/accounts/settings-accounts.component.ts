import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Account } from '../../../../core/models/api.models';
import { AccountsService } from '../../../../core/services/domain/accounts.service';

@Component({
  templateUrl: './settings-accounts.component.html',
  styleUrls: ['./settings-accounts.component.scss']
})
export class SettingsAccountsComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  form: FormGroup;
  formArray: FormArray;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe(accounts => {
      this.buildForm(accounts);
    });
  }

  deleteAccount(account: Account) {
    this.accountsService.deleteOne(account).subscribe(() => {
      this.ngOnInit();
    });
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
      'lastUpdate': [{value: account.lastUpdate, disabled: true}],
      'total': [{value: account.total, disabled: true}]
    });

    formGroup.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Account) {
    this.accountsService.saveOne(value).subscribe();
  }

}
