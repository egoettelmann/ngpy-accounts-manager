import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { DashboardViewComponent } from './dashboard-view.component';

export const STATES: Ng2StateDeclaration[] = [
  {
    name: 'main.dashboard',
    url: '',
    views: {
      'content': DashboardViewComponent
    },
  }
];

export const DashboardViewRoutes = UIRouterModule.forChild({
  states: STATES
});
