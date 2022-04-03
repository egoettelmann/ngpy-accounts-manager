/**
 * The grouped value model
 */
export interface GroupedValue {
  label: string;
  amount: number;
  percentage: number;
  details?: GroupedValue[];
}

/**
 * The chart serie model
 */
export interface ChartSerie {
  name: string;
  data: number[];
}

/**
 * The notification type
 */
export type NotificationType = 'ERROR' | 'INFO' | 'WARNING' | 'SUCCESS';

/**
 * The notification model
 */
export interface Notification {
  type: NotificationType;
  code: string;
  message: string;
  context?: any;
}

/**
 * The alerts model
 */
export interface Alerts {
  labels: number;
  credits: number;
  debits: number;
}
