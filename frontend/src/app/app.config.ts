import {NavComponent} from './nav/nav.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {Ng2StateDeclaration} from '@uirouter/angular';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export class AppConfig {

  public static STATES: Ng2StateDeclaration[] = [
    {
      name: 'root',
      url: '',
      views: {
        '@': AppComponent,
        'nav@root': NavComponent
      }
    },
    {
      name: 'root.dashboard',
      url: '/dashboard',
      views: {
        'content': DashboardComponent
      }
    },
    {
      name: 'root.transactions',
      url: '/transactions/:year/:month',
      views: {
        'content': TransactionsComponent
      },
      params: {
        year: { squash: true, value: null },
        month: { squash: true, value: null }
      }
    }
  ];

}
