/**
 * The application properties DTO
 */
export interface AppProperties {
  appVersion: string;
}

/**
 * The rest error DTO
 */
export interface RestError {
  code: string;
  message: string;
  context?: any;
}

/**
 * The account DTO
 */
export interface Account {
  id: number;
  name: string;
  description: string;
  total: number;
  status: string;
  color: string;
  notify: boolean;
  active: boolean;
  lastUpdate: string;
}

/**
 * The category DTO
 */
export interface Category {
  id: number;
  name: string;
  type?: string;
  color?: string;
  numLabels?: number;
}

/**
 * The key/value DTO
 */
export interface KeyValue {
  key: string;
  value: number;
}

/**
 * The composite key/value DTO
 */
export interface CompositeKeyValue {
  keyOne: string;
  keyTwo: string;
  value: number;
}

/**
 * The label DTO
 */
export interface Label {
  id: number;
  name: string;
  color: string;
  icon?: string;
  category?: Category;
  numTransactions?: number;
}

/**
 * The summary DTO
 */
export interface Summary {
  amountStart: number;
  amountEnd: number;
  totalCredit: number;
  totalDebit: number;
}

/**
 * The transaction DTO
 */
export interface Transaction {
  id?: number;
  reference?: string;
  description?: string;
  dateValue?: string;
  amount?: number;
  note?: string;
  label?: Label;
  account?: Account;
}

/**
 * The budget DTO
 */
export interface Budget {
  id?: number;
  name?: string;
  description?: string;
  period?: string;
  amount?: number;
  accounts?: Account[];
  labels?: Label[];
}

/**
 * The budget status DTO
 */
export interface BudgetStatus {
  budget: Budget;
  spending: number;
}

/**
 * The import result DTO
 */
export interface ImportResult {
  imported: number;
  assigned: number;
  total_amount: number;
}
