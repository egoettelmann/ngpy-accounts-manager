export enum NotificationType {
  ERROR,
  WARNING,
  UNDEFINED
}

export class Notification {

  public type: NotificationType;
  public code: string;
  public content: string;

  constructor(type: NotificationType, code: string, content: string) {
    this.type = type;
    this.code = code;
    this.content = content;
  }
}
