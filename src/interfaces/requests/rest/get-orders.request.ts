import { OrderSide, OrderStatus, OrderType } from '../../../enums';

/**
 * Get orders request params
 */
export interface GetOrdersRequest {
  symbol?: string;

  side?: keyof typeof OrderSide;

  order_type?: keyof typeof OrderType;

  /**
   * An optional tag for this order.
   */
  order_tag?: string;

  status?: keyof typeof OrderStatus;

  /**
   * Start time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  start_t?: number;

  /**
   * End time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  end_t?: number;

  /**
   * The page wish to query.
   */
  page?: number;

  /**
   * The page size wish to query (max: 500)
   */
  size?: number;
}
