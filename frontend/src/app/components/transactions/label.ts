import { Category } from './category';

export class Label {
  public id: number;
  public name: string;
  public color: string;
  public icon: string;
  public category: Category;
  public numTransactions: number;

  constructor(id: number, name: string, color: string, icon: string, numTransactions: number) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
    this.numTransactions = numTransactions;
  }
}
