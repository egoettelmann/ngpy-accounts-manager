import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

/**
 * The responsive service.
 */
@Injectable()
export class ResponsiveService {

  /**
   * Those sizes are the default Clarity/Bootstrap responsive breakpoints.
   */
  private readonly sizes = {
    small: 576,
    medium: 768,
    large: 992,
    xlarge: 1200,
  };

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  /**
   * Checks if the device is 'equal or above' the 'small' size.
   */
  isSmallOrUp(): boolean {
    return this.isEqualOrAbove(this.sizes.small);
  }

  /**
   * Checks if the device is 'equal or above' the 'medium' size.
   */
  isMediumOrUp(): boolean {
    return this.isEqualOrAbove(this.sizes.medium);
  }

  /**
   * Checks if the device is 'equal or above' the 'large' size.
   */
  isLargeOrUp(): boolean {
    return this.isEqualOrAbove(this.sizes.large);
  }

  /**
   * Checks if the device is 'equal or above' the 'xlarge' size.
   */
  isXlargeOrUp(): boolean {
    return this.isEqualOrAbove(this.sizes.xlarge);
  }

  /**
   * Checks if the device is 'equal or above' the provided size.
   *
   * @param size the size to check
   */
  private isEqualOrAbove(size: number): boolean {
    return this.breakpointObserver.isMatched(`(min-width: ${size}px)`)
  }

}
