/**
 * Cancel order request params
 *
 * @link https://docs-api.orderly.network/#cancel-order
 * @link https://docs-api.orderly.network/#cancel-order-by-client_order_id
 */
export interface CancelOrderRequest {
  symbol: string;

  /**
   * ID of the order
   * Required if client_order_id is not passed
   */
  order_id?: number;

  /**
   * client_order_id of the order
   * Required if order_id is not passed
   */
  client_order_id?: number;
}
