import { Component, Input } from '@angular/core';
import { Account } from '../../../../core/models/api.models';

/**
 * The account card component
 */
@Component({
  selector: 'app-dashboard-account-card',
  templateUrl: './dashboard-accounts-card.component.html',
  styleUrls: ['./dashboard-accounts-card.component.scss']
})
export class DashboardAccountsCardComponent {

  /**
   * The account
   */
  @Input() account: Account;

}
