import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html'
})
export class AccountCardComponent implements OnChanges {

  @Input() account: Account;

  ngOnChanges(changes) {
    if (changes.account != null) {
      console.log('AccountCardComponent.ngOnChanges');
    }
  }

}
