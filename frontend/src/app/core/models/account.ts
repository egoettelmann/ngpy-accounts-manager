export class Account {

  public id: number;
  public name: string;
  public description: string;
  public total: number;
  public color: string;
  public notify: boolean;
  public lastUpdate: Date;

  constructor(id: number, name: string, description: string, total: number, color: string, notify: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.total = total;
    this.color = color;
    this.notify = notify;
  }
}
