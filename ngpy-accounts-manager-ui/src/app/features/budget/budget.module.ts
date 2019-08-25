import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BudgetComponent } from './views/budget.component';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetChartComponent } from './components/budget-chart/budget-chart.component';

@NgModule({
  declarations: [
    BudgetComponent,
    BudgetChartComponent
  ],
  imports: [
    SharedModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule {
}
