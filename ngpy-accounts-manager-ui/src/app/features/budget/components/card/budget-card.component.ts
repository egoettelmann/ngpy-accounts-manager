import { Component, Input } from '@angular/core';
import { Budget } from '@core/models/api.models';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,

  ]
})
export class BudgetCardComponent {

  @Input() budget?: Budget;

}
