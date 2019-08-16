export class Account {
  id: number;
  name: string;
  description: string;
  total: number;
  status: string;
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
