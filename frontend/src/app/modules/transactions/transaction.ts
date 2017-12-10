import { Label } from './label';

export class Transaction {

  public id: number;
  public reference: string;
  public description: string;
  public dateValue: Date;
  public amount: number;
  public label: Label;

  constructor(id: number, reference: string, description: string, dateValue: Date, amount: number) {
    this.id = id;
    this.reference = reference;
    this.description = description;
    this.dateValue = dateValue;
    this.amount = amount;
  }
}
