import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import 'rxjs/add/operator/toPromise';
import { AppComponent } from './app.component';

export const APP_STATES: Ng2StateDeclaration[] = [
  {
    name: 'root',
    abstract: true,
    url: '',
    component: AppComponent
  },
  {
    name: 'login.**',
    parent: 'root',
    url: '/login',
    loadChildren: './views/login/login-view.module#LoginViewModule'
  },
  {
    name: 'main.**',
    parent: 'root',
    url: '',
    loadChildren: './views/main/main-view.module#MainViewModule'
  }
];

export const AppRoutes = UIRouterModule.forRoot({
  states: APP_STATES,
  initial: {
    state: 'main.dashboard'
  },
  useHash: true
});
