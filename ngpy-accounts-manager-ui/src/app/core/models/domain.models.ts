/**
 * The grouped value model
 */
export class GroupedValue {
  public label: string;
  public amount: number;
  public percentage: number;
  public details?: GroupedValue[];
}

/**
 * The chart serie model
 */
export class ChartSerie {
  public name: string;
  public data: number[];
}

/**
 * The notification model
 */
export class Notification {
  public type: string;
  public code: string;
  public content: string;
  public data?: {[key: string]: string};
}

/**
 * The alerts model
 */
export class Alerts {
  public labels: number;
  public credits: number;
  public debits: number;
}
