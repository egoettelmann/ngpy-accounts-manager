import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { AnalyticsViewComponent } from './analytics-view.component';
import { CommonFunctions } from '../../../common/common-functions';

export const STATES: Ng2StateDeclaration[] = [
  {
    name: 'main.analytics',
    url: '/analytics/:year?{account}',
    views: {
      'content': AnalyticsViewComponent
    },
    params: {
      year: {value: CommonFunctions.getCurrentYear},
      account: {
        type: 'int',
        array: true,
        dynamic: true
      }
    }
  }
];

export const AnalyticsViewRoutes = UIRouterModule.forChild({
  states: STATES
});
