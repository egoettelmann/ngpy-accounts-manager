import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import 'rxjs/add/operator/toPromise';
import { MainViewComponent } from './main-view.component';
import { SessionService } from '../../services/session.service';
import { NavComponent } from './navigation/nav.component';

export const STATES: Ng2StateDeclaration[] = [
  {
    name: 'main',
    url: '',
    views: {
      '@': MainViewComponent,
      'nav@main': NavComponent
    },
    resolve: [
      {
        token: 'connectedUser',
        deps: [SessionService],
        resolveFn: loadConnectedUser
      }
    ]
  },
  {
    name: 'main.dashboard.**',
    url: '/dashboard',
    loadChildren: './dashboard/dashboard-view.module#DashboardViewModule'
  },
  {
    name: 'main.transactions.**',
    url: '/transactions',
    loadChildren: './transactions/transactions-view.module#TransactionsViewModule'
  },
  {
    name: 'main.treasury.**',
    url: '/treasury',
    loadChildren: './treasury/treasury-view.module#TreasuryViewModule'
  },
  {
    name: 'main.analytics.**',
    url: '/analytics',
    loadChildren: './analytics/analytics-view.module#AnalyticsViewModule'
  }
];

export function loadConnectedUser(sessionService: SessionService): Promise<any> {
  return sessionService.getConnectedUser().toPromise();
}

export const MainViewRoutes = UIRouterModule.forChild({
  states: STATES
});
