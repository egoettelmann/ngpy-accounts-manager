import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFunctions } from '../../../utils/common-functions';

/**
 * The year toggle component
 */
@Component({
  selector: 'app-year-toggle',
  templateUrl: './year-toggle.component.html'
})
export class YearToggleComponent {

  /**
   * The current year
   */
  @Input() currentYear: number;

  /**
   * Triggered on each year change
   */
  @Output() onChange = new EventEmitter<number>();

  /**
   * The list of available years
   */
  public yearList = CommonFunctions.getYearsList();

  /**
   * Triggered on year change.
   *
   * @param year
   */
  changeYear(year: number) {
    this.onChange.emit(year);
  }

}
