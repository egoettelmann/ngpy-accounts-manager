export class Notification {

  public type: string;
  public code: string;
  public content: string;

  constructor(type: string, code: string, content: string) {
    this.type = type;
    this.code = code;
    this.content = content;
  }
}
