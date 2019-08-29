import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BudgetComponent } from './views/budget.component';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetChartComponent } from './components/budget-chart/budget-chart.component';
import { BudgetListComponent } from './views/budget-list/budget-list.component';
import { BudgetDetailsComponent } from './views/budget-details/budget-details.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component';

@NgModule({
  declarations: [
    BudgetComponent,
    BudgetListComponent,
    BudgetDetailsComponent,
    BudgetChartComponent,
    BudgetCardComponent
  ],
  imports: [
    SharedModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule {
}
