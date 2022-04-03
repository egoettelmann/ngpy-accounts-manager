import { Component, Input } from '@angular/core';

/**
 * The card wrapper component
 */
@Component({
  selector: 'app-card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.scss']
})
export class CardWrapperComponent {

  /**
   * The label
   */
  @Input() label?: string;

}
