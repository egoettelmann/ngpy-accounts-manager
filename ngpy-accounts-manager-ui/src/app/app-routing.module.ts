import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginView } from './core/views/login/login.view';
import { MainView } from './core/views/main/main.view';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginView
      },
      {
        path: '',
        component: MainView,
        canActivate: [AuthenticatedGuard],
        children: [
          {
            path: 'dashboard',
            loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
          },
          {
            path: 'transactions',
            loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule)
          },
          {
            path: 'treasury',
            loadChildren: () => import('./features/treasury/treasury.module').then(m => m.TreasuryModule)
          },
          {
            path: 'analytics',
            loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule)
          },
          {
            path: 'budgets',
            loadChildren: () => import('./features/budget/budget.module').then(m => m.BudgetModule)
          },
          {
            path: 'settings',
            loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ]
})
export class AppRoutingModule {

}
