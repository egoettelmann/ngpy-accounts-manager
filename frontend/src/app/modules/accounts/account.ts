export class Account {

  public id: number;
  public name: string;
  public description: string;
  public total: number;
  public color: string;

  constructor(id: number, name: string, description: string, total: number, color: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.total = total;
    this.color = color;
  }
}
