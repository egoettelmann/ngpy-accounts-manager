import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {SessionService} from '../../session.service';
import {AppConfig} from '../../app.config';

declare const Highcharts: any;

@Component({
  selector: 'app-chart',
  template: '&nbsp;',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {

  @Input() options: any;

  private defaultOptions = {
    chart: {
      type: 'column',
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

  constructor(private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options != null && this.options) {
      const opts = Object.assign({}, this.defaultOptions, this.options);
      Highcharts.chart(this.element.nativeElement, opts);
    }
  }

}
