import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {StatisticsService} from '../../modules/statistics/statistics.service';
import {DecimalPipe} from '@angular/common';
import {Summary} from '../../modules/statistics/summary';

@Component({
  templateUrl: './treasury-view.component.html'
})
export class TreasuryViewComponent implements OnInit {

  public yearList = [2017, 2016, 2015, 2014];
  public monthList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  public currentYear: any;
  public graphOptions: any;
  public summary: Summary;

  constructor(private $state: StateService,
              private statisticsService: StatisticsService,
              private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.currentYear = this.$state.params.year;
    this.statisticsService.getEvolution(this.$state.params.year).subscribe(data => {
      this.graphOptions = this.buildChartOptions(data);
    });
    this.statisticsService.getSummary(this.$state.params.year).subscribe(data => {
      this.summary = data;
    });
  }

  buildChartOptions(data: any) {
    const that = this;
    const options = {
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

}
