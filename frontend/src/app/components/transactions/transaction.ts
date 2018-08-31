import { Label } from './label';
import { Account } from '../accounts/account';

export class Transaction {

  public id: number;
  public reference: string;
  public description: string;
  public dateValue: Date;
  public amount: number;
  public label: Label;
  public account: Account;

}

export class PatchEvent<T> {
  public model: T;
  public changes: { [key: string]: any };

  constructor(model: T, changes: { [p: string]: any }) {
    this.model = model;
    this.changes = changes;
  }
}
