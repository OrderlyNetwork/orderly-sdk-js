import { KlineType } from '../enums';

export interface Kline {
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  amount: number;
  symbol: string;
  type: KlineType;
  start_timestamp: number;
  end_timestamp: number;
}
