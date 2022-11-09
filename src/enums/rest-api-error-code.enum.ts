/**
 * Orderly REST API Error codes
 *
 * @link https://docs-api.orderly.network/#error-codes
 */
export enum RestApiErrorCode {
  /**
   * An unknown error occurred while processing the request.
   */
  UNKNOWN = -1000,

  /**
   * The api key or secret is in wrong format.
   */
  INVALID_SIGNATURE = -1001,

  /**
   * API key or secret is invalid, it may because key have insufficient permission or the key is expired/revoked.
   */
  UNAUTHORIZED = -1002,

  /**
   * Rate limit exceed.
   */
  TOO_MANY_REQUEST = -1003,

  /**
   * An unknown parameter was sent.
   */
  UNKNOWN_PARAM = -1004,

  /**
   * Some parameters are in wrong format for api.
   */
  INVALID_PARAM = -1005,

  /**
   * The data is not found in server. For example, when client try canceling a CANCELLED order, will raise this error.
   */
  RESOURCE_NOT_FOUND = -1006,

  /**
   * The data is already exists or your request is duplicated.
   */
  DUPLICATE_REQUEST = -1007,

  /**
   * The quantity of settlement is too high than you can request.
   */
  QUANTITY_TOO_HIGH = -1008,

  /**
   * Can not request withdrawal settlement, you need to deposit other arrears first.
   */
  CAN_NOT_WITHDRAWAL = -1009,

  /**
   * Can not place/cancel orders, it may because internal network error. Please try again in a few seconds.
   */
  RPC_NOT_CONNECT = -1011,

  /**
   * The place/cancel order request is rejected by internal module, it may because the account is in liquidation or other internal errors.
   * Please try again in a few seconds.
   */
  RPC_REJECT = -1012,

  /**
   * The risk exposure for client is too high, it may cause by sending too big order or the leverage is too low.
   * Please refer to client info to check the current exposure.
   */
  RISK_TOO_HIGH = -1101,

  /**
   * The order value (price * size) is too small.
   */
  MIN_NOTIONAL = -1102,

  /**
   * The order price is not following the tick size rule for the symbol.
   */
  PRICE_FILTER = -1103,

  /**
   * The order quantity is not following the step size rule for the symbol.
   */
  SIZE_FILTER = -1104,

  /**
   * Price is X% too high or X% too low from the mid price.
   */
  PERCENTAGE_FILTER = -1105,
}
