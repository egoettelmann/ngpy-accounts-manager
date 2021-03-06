/**
 * The account DTO
 */
export class Account {
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
export class Category {
  id: number;
  name: string;
  type: string;
  color: string;
  numLabels: number;
}

/**
 * The key/value DTO
 */
export class KeyValue {
  key: string;
  value: number;
}

/**
 * The composite key/value DTO
 */
export class CompositeKeyValue {
  keyOne: string;
  keyTwo: string;
  value: number;
}

/**
 * The application properties DTO
 */
export class AppProperties {
  version: string;
}

/**
 * The label DTO
 */
export class Label {
  id: number;
  name: string;
  color: string;
  icon: string;
  category: Category;
  numTransactions: number;
}

/**
 * The summary DTO
 */
export class Summary {
  amountStart: number;
  amountEnd: number;
  totalCredit: number;
  totalDebit: number;
}

/**
 * The transaction DTO
 */
export class Transaction {
  id: number;
  reference: string;
  description: string;
  dateValue: string;
  amount: number;
  note: string;
  label: Label;
  account: Account;
}

/**
 * The budget DTO
 */
export class Budget {
  id: number;
  name: string;
  description: string;
  period: string;
  amount: number;
  accounts: Account[];
  labels: Label[];
}

/**
 * The budget status DTO
 */
export class BudgetStatus {
  budget: Budget;
  spending: number;
}
