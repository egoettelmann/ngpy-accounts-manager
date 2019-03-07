export class Category {
  public id: number;
  public name: string;
  public type: string;
  public numLabels: number;

  constructor(id: number, name: string, type: string, numLabels: number) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.numLabels = numLabels;
  }
}
