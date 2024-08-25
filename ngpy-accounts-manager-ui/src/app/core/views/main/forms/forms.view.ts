import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The main component
 */
@Component({
  standalone: true,
  templateUrl: './forms.view.html',
  styleUrls: ['./forms.view.scss'],
  imports: [RouterOutlet]
})
export class FormsView {
}
