/**
 * Get trades request params
 *
 * @link https://docs-api.orderly.network/#get-trades
 */
export interface GetTradesRequest {
  symbol?: string;

  /**
   * An optional tag for this order.
   */
  tag?: string;

  /**
   * Start time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  start_t?: number;

  /**
   * End time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  end_t?: number;

  page?: number;

  size?: number;
}
