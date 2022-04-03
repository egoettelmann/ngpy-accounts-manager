/**
 * The app route paths
 */
import { RouterPaths } from '@shared/modules/router-path/router-path.models';

export const AppRoutePaths: RouterPaths = {

  // Login
  'route.login': '/login',

  // Forms
  'route.forms.transaction': [{ outlets: { form: '/forms/transactions/:transactionId' } }],
  'route.forms.close': [{ outlets: { form: '' } }],

  // Dashboard
  'route.dashboard': '/dashboard',

  // Transactions
  'route.transactions': '/transactions',
  'route.transactions.list': '/transactions',
  'route.transactions.search': '/transactions/search',

  // Treasury
  'route.treasury': '/treasury',

  // Analytics
  'route.analytics': '/analytics',

  // Budgets
  'route.budgets.list': '/budgets',
  'route.budgets.details': '/budgets/:budgetId',

  // Settings
  'route.settings': '/settings',
  'route.settings.labels': '/settings/labels',
  'route.settings.categories': '/settings/categories',
  'route.settings.accounts': '/settings/accounts',
  'route.settings.transactions': '/settings/transactions'
};
