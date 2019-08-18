import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Account } from '../../../../core/models/api.models';
import * as _ from 'lodash';

@Component({
  selector: 'app-account-toggle',
  templateUrl: './account-toggle.component.html'
})
export class AccountToggleComponent implements OnChanges {

  @Input() accounts: Account[];
  @Input() preSelected: number[] = [];
  @Output() onChange = new EventEmitter<Account[]>();

  selectedAccounts: number[] = [];

  ngOnChanges(changes) {
    if (changes.preSelected && this.preSelected != null) {
      if (this.preSelected.length === 0) {
        this.toggleAllAccounts();
      } else {
        this.toggleAccounts(this.preSelected);
      }
    }
    if (changes.accounts && this.accounts) {
      if (this.selectedAccounts === undefined || this.selectedAccounts.length === 0) {
        this.toggleAllAccounts();
      } else {
        this.toggleAccounts(this.selectedAccounts);
      }
    }
  }

  isSelected(account: Account): boolean {
    if (this.selectedAccounts) {
      return this.selectedAccounts.indexOf(account.id) > -1;
    }
    return false;
  }

  toggleAccount(account: Account) {
    if (this.isSelected(account)) {
      const idx = this.selectedAccounts.indexOf(account.id);
      if (this.selectedAccounts.length > 1) {
        this.selectedAccounts.splice(idx, 1);
      }
    } else {
      this.selectedAccounts.push(account.id);
    }
    this.onChange.emit(this.getSelectedAccounts());
  }

  toggleAllAccounts() {
    const selectedAccounts = this.accounts.map(a => a.id);
    if (!_.isEqual(selectedAccounts, this.selectedAccounts)) {
      this.selectedAccounts = selectedAccounts;
      this.onChange.emit(this.getSelectedAccounts());
    }
  }

  toggleAccounts(accounts: number[]) {
    const selectedAccounts = accounts.slice(0);
    if (!_.isEqual(selectedAccounts, this.selectedAccounts)) {
      this.selectedAccounts = selectedAccounts;
      this.onChange.emit(this.getSelectedAccounts());
    }
  }

  private getSelectedAccounts() {
    return this.accounts.filter((a) => {
      return this.selectedAccounts.indexOf(a.id) > -1;
    });
  }

}
