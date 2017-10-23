import { Component } from '@angular/core';

@Component({
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent {

  public monthList = Array.from(Array(12).keys());

  constructor() {
    console.log('TransactionsComponent');
  }

}
