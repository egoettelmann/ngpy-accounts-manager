import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * The field wrapper for forms
 */
@Component({
  standalone: true,
  selector: 'app-field-wrapper',
  templateUrl: './field-wrapper.component.html',
  styleUrls: ['./field-wrapper.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    JsonPipe,
  ]
})
export class FieldWrapperComponent {

  /**
   * The label/control binding identifier
   */
  @Input() for?: string;

  /**
   * The translation key to use as label
   */
  @Input() i18nLabel?: string;

  /**
   * The form control
   */
  @Input() ctrl?: AbstractControl | null;

  /**
   * Checks if the control is touched and has errors
   */
  public isInvalid(): boolean {
    return !!this.ctrl && this.ctrl.touched && !!this.ctrl.errors;
  }

}
