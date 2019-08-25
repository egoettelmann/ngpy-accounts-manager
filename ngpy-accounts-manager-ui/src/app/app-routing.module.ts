import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './core/views/login/login.component';
import { MainComponent } from './core/views/main/main.component';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        component: MainComponent,
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
            path: 'budget',
            loadChildren: () => import('./features/budget/budget.module').then(m => m.BudgetModule)
          },
          {
            path: 'search',
            loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
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
