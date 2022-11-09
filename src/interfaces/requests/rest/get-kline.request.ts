import { KlineType } from '../../../enums';

/**
 * Get kline request params
 *
 * @link https://docs-api.orderly.network/#kline
 */
export interface GetKlineRequest {
  symbol: string;

  type: KlineType;

  /**
   * Numbers of klines. Maximum of 1000 klines.
   */
  limit?: number;
}
