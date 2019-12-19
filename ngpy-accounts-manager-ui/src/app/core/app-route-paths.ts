const BASE_PATH_ROOT = '';
const BASE_PATH_MAIN = BASE_PATH_ROOT + '';
const BASE_PATH_TRANSACTIONS = BASE_PATH_MAIN + '/transactions';
const BASE_PATH_TREASURY = BASE_PATH_MAIN + '/treasury';
const BASE_PATH_ANALYTICS = BASE_PATH_MAIN + '/analytics';
const BASE_PATH_BUDGETS = BASE_PATH_MAIN + '/budgets';
const BASE_PATH_SETTINGS = BASE_PATH_MAIN + '/settings';

/**
 * The app route paths
 */
export const AppRoutePaths = {

  // Login
  'route.login': BASE_PATH_ROOT + '/login',

  'route.main': BASE_PATH_MAIN,

  // Dashboard
  'route.dashboard': BASE_PATH_MAIN + '/dashboard',

  // Transactions
  'route.transactions': BASE_PATH_TRANSACTIONS,
  'route.transactions.list': BASE_PATH_TRANSACTIONS,
  'route.transactions.search': BASE_PATH_TRANSACTIONS + '/search',
  'route.transactions.form': [BASE_PATH_TRANSACTIONS, { outlets: { form: '/form/:transactionId' } }],

  // Treasury
  'route.treasury': BASE_PATH_TREASURY,

  // Analytics
  'route.analytics': BASE_PATH_ANALYTICS,

  // Budgets
  'route.budgets.list': BASE_PATH_BUDGETS,
  'route.budgets.details': BASE_PATH_BUDGETS + '/:budgetId',

  // Settings
  'route.settings': BASE_PATH_SETTINGS,
  'route.settings.labels': BASE_PATH_SETTINGS + '/labels',
  'route.settings.categories': BASE_PATH_SETTINGS + '/categories',
  'route.settings.accounts': BASE_PATH_SETTINGS + '/accounts',
  'route.settings.transactions': BASE_PATH_SETTINGS + '/transactions'
};
