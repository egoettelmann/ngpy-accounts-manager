import {Component, Input, OnChanges} from '@angular/core';
import {Transaction} from './transaction';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent implements OnChanges{

  @Input() transactions: Transaction[];

  ngOnChanges(changes) {
    if (changes.transactions != null) {
      console.log('TransactionsTableComponent.ngOnChanges');
    }
  }
}
