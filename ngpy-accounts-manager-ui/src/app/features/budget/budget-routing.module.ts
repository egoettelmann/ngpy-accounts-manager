import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetComponent } from './views/budget.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BudgetComponent
      },
      {
        path: ':year',
        component: BudgetComponent
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
