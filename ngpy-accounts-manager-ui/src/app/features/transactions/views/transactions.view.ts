import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './transactions.view.html',
  styleUrls: ['./transactions.view.scss']
})
export class TransactionsView {

  @HostBinding('class') hostClass = 'content-container';

}
