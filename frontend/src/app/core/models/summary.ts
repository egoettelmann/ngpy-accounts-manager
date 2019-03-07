export class Summary {

  public amountStart: number;
  public amountEnd: number;
  public totalCredit: number;
  public totalDebit: number;
  public periodType: 'DAY'|'MONTH'|'YEAR';

  constructor(amountStart: number, amountEnd: number, totalCredit: number, totalDebit: number, periodType) {
    this.amountStart = amountStart;
    this.amountEnd = amountEnd;
    this.totalCredit = totalCredit;
    this.totalDebit = totalDebit;
    this.periodType = periodType;
  }
}
