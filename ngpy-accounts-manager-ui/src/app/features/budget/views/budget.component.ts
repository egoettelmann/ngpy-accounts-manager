import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {

  @HostBinding('class') hostClass = 'content-area';

}
