import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetComponent } from './views/budget.component';
import { BudgetListComponent } from './views/list/budget-list.component';
import { BudgetDetailsComponent } from './views/details/budget-details.component';

export const routes: Routes = [
  {
    path: '',
    component: BudgetComponent,
    children: [
      {
        path: '',
        component: BudgetListComponent
      },
      {
        path: ':budgetId',
        component: BudgetDetailsComponent
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
