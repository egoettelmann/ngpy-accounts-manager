import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Account } from '@core/models/api.models';
import * as _ from 'lodash';

/**
 * The account toggle component
 */
@Component({
  selector: 'app-accounts-toggle',
  templateUrl: './accounts-toggle.component.html'
})
export class AccountsToggleComponent implements OnChanges {

  /**
   * The available accounts
   */
  @Input() accounts?: Account[];

  /**
   * The pre-selected accounts
   */
  @Input() preSelected: number[] = [];

  /**
   * Triggered on each selection change
   */
  @Output() accountsChange = new EventEmitter<number[]>();

  /**
   * The currently selected accounts
   */
  selectedAccounts: number[] = [];

  /**
   * Triggered on any input changes.
   *
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
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

  /**
   * Checks if the provided account is selected.
   *
   * @param account the account to check
   */
  isSelected(account: Account): boolean {
    if (this.selectedAccounts) {
      return this.selectedAccounts.indexOf(account.id) > -1;
    }
    return false;
  }

  /**
   * Toggles a given account.
   *
   * @param account the account to toggle
   */
  toggleAccount(account: Account): void {
    if (this.isSelected(account)) {
      const idx = this.selectedAccounts.indexOf(account.id);
      if (this.selectedAccounts.length > 1) {
        this.selectedAccounts.splice(idx, 1);
      }
    } else {
      this.selectedAccounts.push(account.id);
    }
    this.accountsChange.emit(this.getSelectedAccounts());
  }

  /**
   * Toggles all accounts.
   */
  toggleAllAccounts(): void {
    if (!this.accounts) {
      return;
    }
    const selectedAccounts = this.accounts.map(a => a.id);
    if (!_.isEqual(selectedAccounts, this.selectedAccounts)) {
      this.selectedAccounts = selectedAccounts;
      this.accountsChange.emit(this.getSelectedAccounts());
    }
  }

  /**
   * Toggles a given list of account ids.
   *
   * @param accounts the account ids to toggle
   */
  private toggleAccounts(accounts: number[]): void {
    const selectedAccounts = accounts.slice(0);
    if (!_.isEqual(selectedAccounts, this.selectedAccounts)) {
      this.selectedAccounts = selectedAccounts;
      this.accountsChange.emit(this.getSelectedAccounts());
    }
  }

  /**
   * Get the list of selected account ids.
   */
  private getSelectedAccounts(): number[] {
    if (!this.accounts) {
      return [];
    }
    const accountIds = this.accounts.filter((a) => {
      return this.selectedAccounts.indexOf(a.id) > -1;
    }).map(a => a.id);
    if (accountIds.length === this.accounts.length) {
      return [];
    }
    return accountIds;
  }

}
