import { Category } from './category';

export class Label {
  public id: number;
  public name: string;
  public color: string;
  public icon: string;
  public category: Category;

  constructor(id: number, name: string, color: string, icon: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
  }
}
