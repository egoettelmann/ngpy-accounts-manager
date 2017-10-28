export class Transaction {

  public id: number;
  public reference: string;
  public description: string;
  public date_value: Date;
  public amount: number;

  constructor(id: number, reference: string, description: string, date_value: Date, amount: number) {
    this.id = id;
    this.reference = reference;
    this.description = description;
    this.date_value = date_value;
    this.amount = amount;
  }
}
