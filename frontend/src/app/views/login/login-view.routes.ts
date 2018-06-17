import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { LoginViewComponent } from './login-view.component';

const STATES: Ng2StateDeclaration[] = [
  {
    name: 'login',
    url: '',
    views: {
      '@': LoginViewComponent
    }
  }
];

export const LoginViewRoutes = UIRouterModule.forChild({
  states: STATES
});
