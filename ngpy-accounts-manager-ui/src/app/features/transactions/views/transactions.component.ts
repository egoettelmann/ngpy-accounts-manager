import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  @HostBinding('class') hostClass = 'content-container';

}
