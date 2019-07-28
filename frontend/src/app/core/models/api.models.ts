export class Account {
  public id: number;
  public name: string;
  public description: string;
  public total: number;
  public color: string;
  public notify: boolean;
  public lastUpdate: Date;
}

export class Category {
  public id: number;
  public name: string;
  public type: string;
  public numLabels: number;
}

export class KeyValue {
  public key: string;
  public value: number;
}

export class CompositeKeyValue {
  public keyOne: string;
  public keyTwo: string;
  public value: number;
}

export class AppProperties {
  public version: string;
}

export class Label {
  public id: number;
  public name: string;
  public color: string;
  public icon: string;
  public category: Category;
  public numTransactions: number;
}

export class Summary {
  public amountStart: number;
  public amountEnd: number;
  public totalCredit: number;
  public totalDebit: number;
  public periodType: 'DAY'|'MONTH'|'YEAR';
}

export class Transaction {
  public id: number;
  public reference: string;
  public description: string;
  public dateValue: Date;
  public amount: number;
  public label: Label;
  public account: Account;
}
