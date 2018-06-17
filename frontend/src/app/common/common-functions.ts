export class CommonFunctions {

  public static getCurrentYear(): string {
    const d = new Date();
    return String(d.getFullYear());
  }

  public static getCurrentMonth(): string {
    const d = new Date();
    return String(d.getMonth() + 1);
  }

}
