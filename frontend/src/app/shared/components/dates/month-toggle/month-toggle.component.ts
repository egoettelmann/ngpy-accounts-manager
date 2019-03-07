import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFunctions } from '../../../utils/common-functions';

@Component({
  selector: 'app-month-toggle',
  templateUrl: './month-toggle.component.html'
})
export class MonthToggleComponent {

  @Input() currentMonth: number;
  @Output() onChange = new EventEmitter<number>();

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
