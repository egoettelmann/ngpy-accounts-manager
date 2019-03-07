import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginViewComponent } from './core/views/login/login-view.component';
import { MainViewComponent } from './core/views/main/main-view.component';
import { SessionService } from './core/services/rest/session.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginViewComponent
      },
      {
        path: '',
        component: MainViewComponent,
        resolve: {
          connectedUser: SessionService
        },
        children: [
          {
            path: 'dashboard',
            loadChildren: './features/dashboard/dashboard-view.module#DashboardViewModule'
          },
          {
            path: 'transactions',
            loadChildren: './features/transactions/transactions-view.module#TransactionsViewModule'
          },
          {
            path: 'treasury',
            loadChildren: './features/treasury/treasury-view.module#TreasuryViewModule'
          },
          {
            path: 'analytics',
            loadChildren: './features/analytics/analytics-view.module#AnalyticsViewModule'
          },
          {
            path: 'search',
            loadChildren: './features/search/search-view.module#SearchViewModule'
          },
          {
            path: 'settings',
            loadChildren: './features/settings/settings-view.module#SettingsViewModule'
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
