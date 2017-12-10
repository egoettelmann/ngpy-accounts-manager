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

export class Label {
  public id: number;
  public name: string;
  public color: string;
  public icon: string;


  constructor(id: number, name: string, color: string, icon: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
  }
}
