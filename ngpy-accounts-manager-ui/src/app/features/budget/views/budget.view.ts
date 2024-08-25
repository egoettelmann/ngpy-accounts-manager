import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './budget.view.html',
  styleUrls: ['./budget.view.scss'],
  imports: [RouterOutlet]
})
export class BudgetView {

  @HostBinding('class') hostClass = 'content-area';

}
