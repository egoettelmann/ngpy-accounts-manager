import {NavComponent} from './components/navigation/nav.component';
import {Ng2StateDeclaration} from '@uirouter/angular';
import {AppComponent} from './app.component';
import {LoginViewComponent} from './views/login/login-view.component';
import {SessionService} from './session.service';
import {DashboardViewComponent} from './views/dashboard/dashboard-view.component';
import {TransactionsViewComponent} from './views/transactions/transactions-view.component';

export class AppConfig {

  public static STATES: Ng2StateDeclaration[] = [
    {
      name: 'login',
      url: '/login',
      views: {
        '@': LoginViewComponent
      }
    },
    {
      name: 'root',
      url: '',
      views: {
        '@': AppComponent,
        'nav@root': NavComponent
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
      name: 'root.dashboard',
      url: '/dashboard',
      views: {
        'content': DashboardViewComponent
      }
    },
    {
      name: 'root.transactions',
      url: '/transactions/:year/:month',
      views: {
        'content': TransactionsViewComponent
      },
      params: {
        year: { value: getCurrentYear },
        month: { value: getCurrentMonth }
      }
    }
  ];

}

export function loadConnectedUser(sessionService: SessionService): any {
  return sessionService.getConnectedUser();
}

export function getCurrentYear(): string {
  const d = new Date();
  return String(d.getFullYear());
}

export function getCurrentMonth(): string {
  const d = new Date();
  return String(d.getMonth() + 1);
}
