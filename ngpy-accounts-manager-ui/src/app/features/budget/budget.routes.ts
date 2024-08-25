import { Routes } from '@angular/router';

export const budgetRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/budget.view').then(m => m.BudgetView),
    children: [
      {
        path: '',
        loadComponent: () => import('./views/list/budget-list.view').then(m => m.BudgetListView)
      },
      {
        path: ':budgetId',
        loadComponent: () => import('./views/details/budget-details.view').then(m => m.BudgetDetailsView)
      }
    ]
  }
];
