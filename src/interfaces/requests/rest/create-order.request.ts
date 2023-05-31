import { OrderSide, OrderType } from '../../../enums';
import { ValidationResponse } from '../../utils';

/**
 * Create Order request parameters
 *
 * @link https://docs-api.orderly.network/#create-order
 */
export interface CreateOrderRequest {
  symbol: string;

  client_order_id?: string;

  broker_id?: string;

  order_type: keyof typeof OrderType;

  /**
   * If order_type is MARKET, then is not required, otherwise this parameter is required.
   */
  order_price?: number;

  /**
   * For MARKET/ASK/BID order, if order_amount is given, it is not required
   */
  order_quantity?: number | string;

  /**
   * For MARKET/ASK/BID order, the order size in terms of quote currency
   */
  order_amount?: number;

  /**
   * The order quantity shown on orderbook. (default: equal to order_quantity)
   */
  visible_quantity?: number;

  side: keyof typeof OrderSide;
}

export const validateCreateOrderRequest = (params: CreateOrderRequest): ValidationResponse => {
  const errors: string[] = [];

  if (!params.order_price && params.order_type !== OrderType.MARKET) {
    errors.push('order_price is required');
  }

  if (
    !params.order_amount &&
    ![OrderType.BID, OrderType.ASK, OrderType.MARKET].includes(OrderType[params.order_type])
  ) {
    errors.push('order_amount is required');
  }

  return { success: errors.length === 0, errors };
};
