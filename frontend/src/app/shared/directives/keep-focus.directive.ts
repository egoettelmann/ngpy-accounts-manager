import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { KeepFocusService } from '../../core/services/keep-focus.service';

@Directive({
  selector: '[keepFocus]'
})
export class KeepFocusDirective implements OnInit {

  @Input('keepFocus') id: string;

  constructor(
    private elementRef: ElementRef,
    private keepFocusService: KeepFocusService
  ) {}

  ngOnInit(): void {
    if (this.keepFocusService.hasFocus(this.id)) {
      this.elementRef.nativeElement.focus();
    }
  }

  @HostListener('focus')
  focusIn() {
    this.keepFocusService.setFocus(this.id);
  }

  @HostListener('focusout')
  focusOut() {
    this.keepFocusService.unsetFocus(this.id);
  }

}
