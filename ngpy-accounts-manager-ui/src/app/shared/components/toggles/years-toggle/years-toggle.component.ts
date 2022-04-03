import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateService } from '@core/services/date.service';

/**
 * The year toggle component
 */
@Component({
  selector: 'app-years-toggle',
  templateUrl: './years-toggle.component.html'
})
export class YearsToggleComponent implements OnInit {

  /**
   * The current year
   */
  @Input() currentYear?: number;

  /**
   * Triggered on each year change
   */
  @Output() onChange = new EventEmitter<number>();

  /**
   * Instantiates the component.
   *
   * @param dateService the date service
   */
  constructor(private dateService: DateService) {}

  /**
   * The list of available years
   */
  public yearList?: number[];

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.yearList = this.dateService.getYearsList();
  }

  /**
   * Triggered on year change.
   *
   * @param year the new year
   */
  changeYear(year: number): void {
    this.onChange.emit(year);
  }

}
