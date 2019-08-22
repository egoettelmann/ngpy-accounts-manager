import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';

/**
 * The Date service
 */
@Injectable()
export class DateService {

  /**
   * The date format to use across the entire application
   */
  private readonly dateFormat: string = 'yyyy-MM-dd';

  /**
   * The starting year for all year lists
   */
  private readonly startingYear: number = 2014;

  /**
   * The starting month of a period (starting at 0 for January)
   */
  private readonly periodStartingMonth: number = 0;

  /**
   * The starting day of a period (starting at 1 for the first day)
   */
  private readonly periodStartingDay: number = 1;

  /**
   * Gets the current year.
   */
  getCurrentYear() {
    return new Date().getFullYear();
  }

  /**
   * Gets the current months (starting at 1 for January).
   */
  getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  /**
   * Get the list of months (starting at 1 for January).
   */
  getMonthsList(): number[] {
    return Array.from(Array(12)).map((e, i) => i + 1);
  }

  /**
   * Gets a list of years from a given start year to the current year.
   */
  getYearsList(startYear?: number): number[] {
    if (startYear === undefined) {
      startYear = this.startingYear;
    }
    return Array.from(Array(this.getCurrentYear() - startYear + 1))
      .map((e, i) => i + startYear)
      .reverse();
  }

  /**
   * Gets the starting date of a period for a year and an optional month.
   *
   * @param year the year
   * @param month the optional month
   */
  getPeriodStart(year: number, month?: number): Date {
    if (month == null) {
      return new Date(year, this.periodStartingMonth, this.periodStartingDay);
    }
    return new Date(year, month - 1, this.periodStartingDay);
  }

  /**
   * Gets the ending date of a period for a year and an optional month.
   *
   * @param year the year
   * @param month the optional month
   */
  getPeriodEnd(year: number, month?: number): Date {
    if (month == null) {
      return new Date(year + 1, this.periodStartingMonth, this.periodStartingDay);
    } else if (month === 12) {
      return new Date(year + 1, this.periodStartingMonth, this.periodStartingDay);
    }
    return new Date(year, month, this.periodStartingDay);
  }

  /**
   * Formats a date.
   *
   * @param date the date to format
   */
  format(date: Date): string {
    return format(date, this.dateFormat);
  }

  /**
   * Parses a formatted date.
   *
   * @param formattedDate the formatted date
   */
  parse(formattedDate: string): Date {
    return parse(formattedDate, this.dateFormat, new Date());
  }

}
