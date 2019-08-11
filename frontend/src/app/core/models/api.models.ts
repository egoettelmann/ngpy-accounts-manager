export class Account {
  id: number;
  name: string;
  description: string;
  total: number;
  color: string;
  notify: boolean;
  lastUpdate: Date;
}

export class Category {
  id: number;
  name: string;
  type: string;
  numLabels: number;
}

export class KeyValue {
  key: string;
  value: number;
}

export class CompositeKeyValue {
  keyOne: string;
  keyTwo: string;
  value: number;
}

export class AppProperties {
  version: string;
}

export class Label {
  id: number;
  name: string;
  color: string;
  icon: string;
  category: Category;
  numTransactions: number;
}

export class Summary {
  amountStart: number;
  amountEnd: number;
  totalCredit: number;
  totalDebit: number;
  periodType: 'DAY'|'MONTH'|'YEAR';
}

export class Transaction {
  id: number;
  reference: string;
  description: string;
  dateValue: Date;
  amount: number;
  label: Label;
  account: Account;
}

export class FilterCriteria {
  accountIds?: number[];
  dateFrom?: Date;
  dateTo?: Date;
  labelIds?: number[];
  categoryType?: string;
  reference?: string;
  description?: string;
  min?: number;
  max?: number;
}

export class PageRequest {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'ASC' | 'DESC';
}
