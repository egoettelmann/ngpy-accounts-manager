import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetView } from './views/budget.view';
import { BudgetListView } from './views/list/budget-list.view';
import { BudgetDetailsView } from './views/details/budget-details.view';

export const routes: Routes = [
  {
    path: '',
    component: BudgetView,
    children: [
      {
        path: '',
        component: BudgetListView
      },
      {
        path: ':budgetId',
        component: BudgetDetailsView
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class BudgetRoutingModule {

}
