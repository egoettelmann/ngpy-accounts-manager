import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetComponent } from './views/budget.component';
import { BudgetListComponent } from './views/budget-list/budget-list.component';
import { BudgetDetailsComponent } from './views/budget-details/budget-details.component';

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
        path: ':year',
        component: BudgetListComponent
      },
      {
        path: 'details/:budgetId',
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
