import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

@Component({
  selector: 'app-chart',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges, AfterViewInit {

  @Input() title: string;
  @Input() options: any;

  @ViewChild('graphContainer', { static: false }) graphContainer: ElementRef;

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
      this.drawChart();
    }
  }

  ngAfterViewInit(): void {
    this.drawChart();
  }

  private drawChart() {
    if (this.options && this.graphContainer) {
      const opts = _.merge({}, this.defaultOptions, this.options);
      Highcharts.chart(this.graphContainer.nativeElement, opts);
    }
  }

}
