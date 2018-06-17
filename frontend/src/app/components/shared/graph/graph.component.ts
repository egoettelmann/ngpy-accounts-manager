import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

@Component({
  selector: 'app-chart',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges {

  @Input() title: string;
  @Input() options: any;

  @ViewChild("graphContainer") graphContainer: ElementRef;

  private defaultOptions = {
    chart: {
      backgroundColor: 'none',
      width: null
    },
    title: {
      text: null
    },
    yAxis: {
      labels: {
        format: '{value:.2f}'
      },
      title: {
        text: null
      }
    },
    credits: {
      enabled: false
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options != null && this.options) {
      const opts = _.merge({}, this.defaultOptions, this.options);
      Highcharts.chart(this.graphContainer.nativeElement, opts);
    }
  }

}
