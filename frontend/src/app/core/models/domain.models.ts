export class GroupedValue {
  public label: string;
  public amount: number;
  public percentage: number;
  public details?: GroupedValue[];
}

export class ChartSerie {
  public name: string;
  public data: number[];
}

export class Notification {
  public type: string;
  public code: string;
  public content: string;
}

export class Alerts {
  public labels: number;
  public credits: number;
  public debits: number;
}
