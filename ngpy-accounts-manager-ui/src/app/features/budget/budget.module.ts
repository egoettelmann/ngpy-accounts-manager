import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BudgetComponent } from './views/budget.component';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetChartComponent } from './components/chart/budget-chart.component';
import { BudgetListComponent } from './views/list/budget-list.component';
import { BudgetDetailsComponent } from './views/details/budget-details.component';
import { BudgetCardComponent } from './components/card/budget-card.component';
import { BudgetHistoryChartComponent } from './components/history-chart/budget-history-chart.component';
import { BudgetSummaryComponent } from './components/summary/budget-summary.component';
import { BudgetFormComponent } from './components/form/budget-form.component';

@NgModule({
  declarations: [
    BudgetComponent,
    BudgetListComponent,
    BudgetDetailsComponent,
    BudgetChartComponent,
    BudgetCardComponent,
    BudgetHistoryChartComponent,
    BudgetSummaryComponent,
    BudgetFormComponent
  ],
  imports: [
    SharedModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule {
}
