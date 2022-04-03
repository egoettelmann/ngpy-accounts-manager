import { Component, Input } from '@angular/core';
import { Budget } from '@core/models/api.models';

@Component({
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.scss']
})
export class BudgetCardComponent {

  @Input() budget?: Budget;

}
