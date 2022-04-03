import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BudgetView } from './views/budget.view';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetChartComponent } from './components/chart/budget-chart.component';
import { BudgetListView } from './views/list/budget-list.view';
import { BudgetDetailsView } from './views/details/budget-details.view';
import { BudgetCardComponent } from './components/card/budget-card.component';
import { BudgetHistoryChartComponent } from './components/history-chart/budget-history-chart.component';
import { BudgetSummaryComponent } from './components/summary/budget-summary.component';
import { BudgetFormComponent } from './components/form/budget-form.component';

@NgModule({
  declarations: [
    BudgetView,
    BudgetListView,
    BudgetDetailsView,
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
