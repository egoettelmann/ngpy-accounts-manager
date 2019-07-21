import { Component, Input } from '@angular/core';
import { Account } from '../../../../core/models/api.models';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html'
})
export class AccountCardComponent {

  @Input() account: Account;

}
