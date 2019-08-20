import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * The field wrapper for forms
 */
@Component({
  selector: 'app-field-wrapper',
  templateUrl: './field-wrapper.component.html',
  styleUrls: ['./field-wrapper.component.scss']
})
export class FieldWrapperComponent {

  /**
   * The label/control binding identifier
   */
  @Input() for: string;

  /**
   * The translation key to use as label
   */
  @Input() i18nLabel: string;

  /**
   * The form control
   */
  @Input() ctrl: AbstractControl;

  /**
   * Checks if the control is touched and has errors
   */
  public isValid() {
    return this.ctrl.touched && this.ctrl.errors;
  }

}
