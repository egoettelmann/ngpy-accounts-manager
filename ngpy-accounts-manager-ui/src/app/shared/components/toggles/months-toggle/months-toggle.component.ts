import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateService } from '../../../../core/services/date.service';

/**
 * The month toggle component
 */
@Component({
  selector: 'app-months-toggle',
  templateUrl: './months-toggle.component.html'
})
export class MonthsToggleComponent implements OnInit {

  /**
   * The current month
   */
  @Input() currentMonth: number;

  /**
   * Triggered on each selection change
   */
  @Output() onChange = new EventEmitter<number>();

  /**
   * Instantiates the component.
   *
   * @param dateService the date service
   */
  constructor(private dateService: DateService) {}

  /**
   * The available list of months
   */
  public monthList: number[];

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.monthList = this.dateService.getMonthsList();
  }

  /**
   * Triggered on month change.
   *
   * @param month
   */
  changeMonth(month: number) {
    this.onChange.emit(month);
  }

}
