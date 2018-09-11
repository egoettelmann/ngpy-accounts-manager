import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonFunctions } from '../../common/common-functions';

@Component({
  selector: 'app-year-toggle',
  templateUrl: './year-toggle.component.html'
})
export class YearToggleComponent {

  @Input() currentYear: number;
  @Output() onChange = new EventEmitter<number>();

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
