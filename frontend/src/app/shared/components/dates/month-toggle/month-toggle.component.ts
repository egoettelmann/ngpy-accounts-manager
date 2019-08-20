import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFunctions } from '../../../utils/common-functions';

/**
 * The month toggle component
 */
@Component({
  selector: 'app-month-toggle',
  templateUrl: './month-toggle.component.html'
})
export class MonthToggleComponent {

  /**
   * The current month
   */
  @Input() currentMonth: number;

  /**
   * Triggered on each selection change
   */
  @Output() onChange = new EventEmitter<number>();

  /**
   * The available list of months
   */
  public monthList = CommonFunctions.getMonthsList();

  /**
   * Triggered on month change.
   *
   * @param month
   */
  changeMonth(month: number) {
    this.onChange.emit(month);
  }

}
