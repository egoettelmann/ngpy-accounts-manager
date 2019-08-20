import { Component, Input } from '@angular/core';
import { Account } from '../../../../core/models/api.models';

/**
 * The account card component
 */
@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent {

  /**
   * The account
   */
  @Input() account: Account;

}
