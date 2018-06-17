import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { TransactionsViewComponent } from './transactions-view.component';
import { CommonFunctions } from '../../../common/common-functions';

export const STATES: Ng2StateDeclaration[] = [
  {
    name: 'main.transactions',
    url: '/transactions/:year/:month?{account}',
    views: {
      'content': TransactionsViewComponent
    },
    params: {
      year: {value: CommonFunctions.getCurrentYear},
      month: {value: CommonFunctions.getCurrentMonth},
      account: {
        type: 'int',
        array: true,
        dynamic: true
      }
    }
  }
];

export const TransactionsViewRoutes = UIRouterModule.forChild({
  states: STATES
});
