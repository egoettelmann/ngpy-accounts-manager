import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {TransactionsService} from '../../modules/transactions/transactions.service';

@Component({
  templateUrl: './transactions-view.component.html'
})
export class TransactionsViewComponent implements OnInit {

  public yearList = [2017, 2016, 2015, 2014];
  public monthList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  public currentYear: any;
  public transactions: any[];

  constructor(private $state: StateService, private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    this.transactionsService.getTransactions(this.$state.params.year, this.$state.params.month).then(data => {
      this.transactions = data;
    });
  }

}
