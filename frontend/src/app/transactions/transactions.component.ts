import { Component } from '@angular/core';

@Component({
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent {

  public monthList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  constructor() {
    console.log('TransactionsComponent');
  }

}
