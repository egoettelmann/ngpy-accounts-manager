import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

/**
 * The graph component
 */
@Component({
  selector: 'app-chart',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges, AfterViewInit {

  /**
   * The title of the graph
   */
  @Input() title: string;

  /**
   * The graph options
   */
  @Input() options: any;

  /**
   * The reference to the graph container element
   */
  @ViewChild('graphContainer', { static: false }) graphContainer: ElementRef;

  /**
   * The graph default options
   */
  private defaultOptions: Highcharts.Options = {
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

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options != null && this.options) {
      this.drawChart();
    }
  }

  /**
   * Triggered once the DOM is ready
   */
  ngAfterViewInit(): void {
    this.drawChart();
  }

  /**
   * Draws the chart
   */
  private drawChart() {
    if (this.options && this.graphContainer) {
      const opts = _.merge({}, this.defaultOptions, this.options);
      Highcharts.chart(this.graphContainer.nativeElement, opts);
    }
  }

}
