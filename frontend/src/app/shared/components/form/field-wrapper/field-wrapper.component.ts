import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-wrapper',
  templateUrl: './field-wrapper.component.html',
  styleUrls: ['./field-wrapper.component.scss']
})
export class FieldWrapperComponent {

  @Input() for: string;
  @Input() i18nLabel: string;
  @Input() ctrl: AbstractControl;

  public isValid() {
    return this.ctrl.touched && this.ctrl.errors;
  }

}
