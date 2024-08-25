import { Routes } from '@angular/router';
import { authenticatedGuard } from '@core/guards/authenticated.guard';
import { FormsView } from '@core/views/main/forms/forms.view';
import { FormsTransactionView } from '@core/views/main/forms/transaction/forms-transaction.view';
import { MainResolverService } from '@core/services/resolvers/main-resolver.service';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/views/login/login.view').then(m => m.LoginView)
  },
  {
    path: '',
    canActivate: [authenticatedGuard()],
    resolve: {
      data: MainResolverService
    },
    loadComponent: () => import('./core/views/main/main.view').then(m => m.MainView),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.transactionsRoutes)
      },
      {
        path: 'treasury',
        loadChildren: () => import('./features/treasury/treasury.routes').then(m => m.treasuryRoutes)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/analytics/analytics.routes').then(m => m.analyticsRoutes)
      },
      {
        path: 'budgets',
        loadChildren: () => import('./features/budget/budget.routes').then(m => m.budgetRoutes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: 'forms',
    component: FormsView,
    outlet: 'form',
    children: [
      {
        path: 'transactions/:transactionId',
        component: FormsTransactionView
      }
    ]
  }
];
