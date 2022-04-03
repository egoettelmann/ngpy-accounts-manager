import { Component, Input } from '@angular/core';
import { Account } from '@core/models/api.models';

/**
 * The account card component
 */
@Component({
  selector: 'app-dashboard-account-card',
  templateUrl: './dashboard-account-card.component.html',
  styleUrls: ['./dashboard-account-card.component.scss']
})
export class DashboardAccountCardComponent {

  /**
   * The account
   */
  @Input() account?: Account;

}
