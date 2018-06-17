import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { TreasuryViewComponent } from './treasury-view.component';
import { CommonFunctions } from '../../../common/common-functions';

export const STATES: Ng2StateDeclaration[] = [
  {
    name: 'main.treasury',
    url: '/treasury/:year?{account}',
    views: {
      'content': TreasuryViewComponent
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

export const TreasuryViewRoutes = UIRouterModule.forChild({
  states: STATES
});
