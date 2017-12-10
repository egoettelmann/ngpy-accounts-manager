import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {TransactionsService} from '../../modules/transactions/transactions.service';
import {StatisticsService} from '../../modules/statistics/statistics.service';
import {DecimalPipe} from '@angular/common';
import { Transaction } from '../../modules/transactions/transaction';

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
  public graphOptions: any;
  public summary: any;
  public selectedTransaction: Transaction;

  constructor(private $state: StateService,
              private transactionsService: TransactionsService,
              private statisticsService: StatisticsService,
              private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    this.transactionsService.getAll(this.$state.params.year, this.$state.params.month).subscribe(data => {
      this.transactions = data;
    });
    this.statisticsService.getGroupedByLabel(this.$state.params.year, this.$state.params.month).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
    this.statisticsService.getSummary(this.$state.params.year, this.$state.params.month).subscribe(data => {
      this.summary = data;
    });
  }

  buildChartOptions(data: any) {
    const that = this;
    const options = {
      chart: {
        type: 'column'
      },
      tooltip: {
        formatter: function () {
          return '' + this.x + ': <b>' + that.decimalPipe.transform(this.y, '1.2-2') + ' €</b>';
        }
      },
      xAxis: {
        categories: []
      },
      series: [{
        data: [],
        showInLegend: false
      }]
    };
    for (const d of data) {
      options.xAxis.categories.push(d.label);
      options.series[0].data.push(d.value);
    }
    return options;
  }

  editTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
  }

  saveTransaction(transaction: Transaction) {
    console.log('SAVING', transaction);
  }

}
