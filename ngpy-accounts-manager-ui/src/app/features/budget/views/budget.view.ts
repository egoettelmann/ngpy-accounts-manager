import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './budget.view.html',
  styleUrls: ['./budget.view.scss']
})
export class BudgetView {

  @HostBinding('class') hostClass = 'content-area';

}
