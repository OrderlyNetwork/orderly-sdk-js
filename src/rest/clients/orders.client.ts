import axios, { AxiosError, AxiosInstance } from 'axios';

import { Order } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import {
  CancelOrderRequest,
  CancelOrdersRequest,
  CreateBatchOrderRequest,
  CreateOrderRequest,
  GetOrderRequest,
  GetOrdersRequest,
  validateCreateOrderRequest,
} from '../../interfaces/requests';
import {
  CancelOrderResponse,
  CreateBatchOrderResponse,
  CreateOrderData,
  CreateOrderResponse,
  GetOrderbookResponse,
  GetOrderResponse,
  GetOrdersResponse,
  OrderbookData,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient, ValidationResponse } from '../../interfaces/utils';
import { generateGetHeaders, generatePostHeadersAndRequestData } from '../utils/generateHeaders';

export type OrdersType = {
  /**
   * Place order maker/taker, the order executed information will be update from websocket stream.
   * Will response immediately with an order created message.
   *
   * @link https://docs-api.orderly.network/#create-order
   */
  create: (params: CreateOrderRequest) => Promise<CreateOrderData>;

  /**
   * Create multiple orders at once
   *
   * @link https://docs-api.orderly.network/#batch-create-order
   */
  createBatch: (params: CreateBatchOrderRequest) => Promise<CreateOrderData[]>;

  /**
   * Cancel order
   *
   * @link https://docs-api.orderly.network/#cancel-order
   * @link https://docs-api.orderly.network/#cancel-order-by-client_order_id
   */
  cancel: (params: CancelOrderRequest) => Promise<{ status: string }>;

  /**
   * Cancel all orders based on symbol
   *
   * @link https://docs-api.orderly.network/#cancel-orders
   */
  cancelBatch: (params: CancelOrdersRequest) => Promise<{ status: string }>;

  /**
   * Get order
   *
   * @link https://docs-api.orderly.network/#get-order
   * @link https://docs-api.orderly.network/#get-order-by-client_order_id
   */
  getOrder: (params: GetOrderRequest) => Promise<Order>;

  /**
   * Get orders
   *
   * @link https://docs-api.orderly.network/#get-orders
   */
  getOrders: (params: GetOrdersRequest) => Promise<Order[]>;

  /**
   * Get orderbook
   * Snapshot of current orderbook. Price of asks/bids are in descending order.
   *
   * @link https://docs-api.orderly.network/#orderbook-snapshot
   */
  getOrderbook: (symbol: string, maxLevel?: number) => Promise<OrderbookData>;
};

export class OrdersClient extends GenericClient {
  private instance: AxiosInstance;

  constructor(private config: AuthorizedConfigurationOptions, private accountId: string, debug = false) {
    super('Orders REST Client', debug);

    this.instance = axios.create({
      baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`
    });
  }

  get orders(): OrdersType {
    return {
      create: async params => {
        try {
          // const validateResponse = validateCreateOrderRequest(params);

          // if (!validateResponse.success) {
          //   throw new Error(JSON.stringify(validateResponse.errors));
          // }

          // console.log('createOrders', this.accountId);
          // console.log(params, params);

          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'POST',
            '/v1/order',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
          );

          const { data: response } = await this.instance.post<CreateOrderResponse>('/order', requestData, {
            headers: headers,
          });

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Create order failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Create order failed');
          } else {
            this.logger.error(error.message, 'Create order failed');
          }

          throw error;
        }
      },
      createBatch: async params => {
        try {

          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'POST',
            '/v1/batch-order',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
          );
          const { data: response } = await this.instance.post<CreateBatchOrderResponse>(
            'batch-order',
            { orders: requestData },
            {
              headers: headers,
            },
          );

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Batch create order failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Batch create order failed');
          } else {
            this.logger.error(error.message, 'Batch create order failed');
          }

          throw error;
        }
      },
      cancel: async params => {
        try {
          if (!params.order_id && !params.client_order_id) {
            throw new Error('You need to pass either order_id or client_order_id param');
          }

          const url = params.client_order_id ? '/client/order' : '/order';

          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'DELETE',
            `/v1${url}`,
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
            true,
          );

          console.log(headers);

          const { data: response } = await axios.delete<CancelOrderResponse>(`${this.config.apiUrl}/${this.config.apiVersion}${url}`, {
            headers,
            params: requestData,
            data: null
          });

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Cancel order failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Cancel order failed');
          } else {
            this.logger.error(error.message, 'Cancel order failed');
          }

          throw error;
        }
      },
      cancelBatch: async params => {
        try {
          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'DELETE',
            '/v1/order',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
            true,
          );

          const { data: response } = await this.instance.delete<CancelOrderResponse>('orders', {
            params: requestData,
            headers,
          });

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Cancel orders failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Cancel orders failed');
          } else {
            this.logger.error(error.message, 'Cancel orders failed');
          }

          throw error;
        }
      },
      getOrder: async params => {
        try {
          if (!params.order_id && !params.client_order_id) {
            throw new Error('You need to pass either order_id or client_order_id param');
          }

          const url = params.client_order_id ? `client/order/${params.client_order_id}` : `order/${params.order_id}`;
          const headers = await generateGetHeaders(
            'GET',
            `/v1/order/${params.order_id ? params.order_id : params.client_order_id}`,
            null,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
          );

          const { data: response } = await this.instance.get<GetOrderResponse>(url, {
            headers,
          });

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get order failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get order failed');
          } else {
            this.logger.error(error.message, 'Get order failed');
          }

          throw error;
        }
      },
      getOrders: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/orders',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            true
          );

          const { data: response } = await this.instance.get<GetOrdersResponse>('/orders', {
            params,
            headers: headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get orders failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get orders failed');
          } else {
            this.logger.error(error.message, 'Get orders failed');
          }

          throw error;
        }
      },
      getOrderbook: async (symbol, maxLevel = 100) => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            `/v1/orderbook/${symbol}`,
            { max_level: maxLevel },
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            true,
          );

          const { data: response } = await this.instance.get<GetOrderbookResponse>(`orderbook/${symbol}`, {
            params: {
              max_level: maxLevel,
            },
            headers,
          });

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get orderbook failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get orderbook failed');
          } else {
            this.logger.error(error.message, 'Get orderbook failed');
          }

          throw error;
        }
      },
    };
  }
}
