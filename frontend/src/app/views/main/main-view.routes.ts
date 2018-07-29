import { MainViewComponent } from './main-view.component';
import { SessionService } from '../../services/session.service';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: MainViewComponent,
    resolve: {
      connectedUser: SessionService
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard-view.module#DashboardViewModule'
      },
      {
        path: 'transactions',
        loadChildren: './transactions/transactions-view.module#TransactionsViewModule'
      },
      {
        path: 'treasury',
        loadChildren: './treasury/treasury-view.module#TreasuryViewModule'
      },
      {
        path: 'analytics',
        loadChildren: './analytics/analytics-view.module#AnalyticsViewModule'
      },
      {
        path: 'search',
        loadChildren: './search/search-view.module#SearchViewModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings-view.module#SettingsViewModule'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

export const MainViewRoutes = RouterModule.forChild(ROUTES);
