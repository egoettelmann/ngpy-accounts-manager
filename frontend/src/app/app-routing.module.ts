import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './core/views/login/login.component';
import { MainComponent } from './core/views/main/main.component';
import { SessionRestService } from './core/services/rest/session-rest.service';

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
        resolve: {
          connectedUser: SessionRestService
        },
        children: [
          {
            path: 'dashboard',
            loadChildren: './features/dashboard/dashboard.module#DashboardModule'
          },
          {
            path: 'transactions',
            loadChildren: './features/transactions/transactions.module#TransactionsModule'
          },
          {
            path: 'treasury',
            loadChildren: './features/treasury/treasury.module#TreasuryModule'
          },
          {
            path: 'analytics',
            loadChildren: './features/analytics/analytics.module#AnalyticsModule'
          },
          {
            path: 'search',
            loadChildren: './features/search/search.module#SearchModule'
          },
          {
            path: 'settings',
            loadChildren: './features/settings/settings.module#SettingsModule'
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
