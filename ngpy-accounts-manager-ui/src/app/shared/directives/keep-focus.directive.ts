import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { KeepFocusService } from '@core/services/keep-focus.service';

/**
 * The keep focus directive.
 * Forces an element to keep the focus when the DOM is re-rendered.
 */
@Directive({
  selector: '[appKeepFocus]'
})
export class KeepFocusDirective implements OnInit {

  /**
   * The unique id that identifies the DOM element
   */
  @Input('appKeepFocus') id?: string;

  /**
   * Instantiates the directive.
   *
   * @param elementRef the element ref
   * @param keepFocusService the keep focus service
   */
  constructor(
    private elementRef: ElementRef,
    private keepFocusService: KeepFocusService
  ) {
  }

  /**
   * Initializes the directive
   */
  ngOnInit(): void {
    if (this.id && this.keepFocusService.hasFocus(this.id)) {
      this.elementRef.nativeElement.focus();
    }
  }

  /**
   * Listens on the focus event
   */
  @HostListener('focus')
  focusIn(): void {
    if (this.id) {
      this.keepFocusService.setFocus(this.id);
    }
  }

  /**
   * Listens on the focus out event
   */
  @HostListener('focusout')
  focusOut(): void {
    if (this.id) {
      this.keepFocusService.unsetFocus(this.id);
    }
  }

}
