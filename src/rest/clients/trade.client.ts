import axios, { AxiosError, AxiosInstance } from 'axios';

import { Kline, OrderTrade } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { GetKlineRequest } from '../../interfaces/requests';
import {
  GetKlineResponse,
  GetOrderTradesResponse,
  GetTradeResponse,
  GetTradesResponse,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient } from '../../interfaces/utils';

export type TradeType = {
  /**
   * The latest klines of the trading pairs.
   *
   * @link https://docs-api.orderly.network/#kline
   */
  getKline: (params: GetKlineRequest) => Promise<Kline[]>;

  /**
   * Get specific order trades by order_id.
   *
   * @link https://docs-api.orderly.network/#get-all-trades-of-specific-order
   */
  getOrderTrades: (orderId: number) => Promise<OrderTrade[]>;

  /**
   * Return client’s trades history in a range of time.
   *
   * @link https://docs-api.orderly.network/#get-trades
   */
  getTrades: (params: GetTradesResponse) => Promise<OrderTrade[]>;

  /**
   * Get specific transaction detail by trade id.
   *
   * @link https://docs-api.orderly.network/#get-trade
   */
  getTrade: (tradeId: number) => Promise<OrderTrade>;
};

export class TradeClient extends GenericClient {
  private instance: AxiosInstance;

  constructor(private config: AuthorizedConfigurationOptions, debug = false) {
    super('Trade REST Client', debug);

    this.instance = axios.create({
      baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
    });
  }

  get trade(): TradeType {
    return {
      getKline: async params => {
        try {
          const { data: response } = await this.instance.get<GetKlineResponse>('kline', {
            params,
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
      getOrderTrades: async orderId => {
        try {
          const { data: response } = await this.instance.get<GetOrderTradesResponse>(`order/${orderId}/trades`);

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get order trades failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get order trades failed');
          } else {
            this.logger.error(error.message, 'Get order trades failed');
          }

          throw error;
        }
      },
      getTrades: async params => {
        try {
          const { data: response } = await this.instance.get<GetTradesResponse>('trades', {
            params,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get trades failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get trades failed');
          } else {
            this.logger.error(error.message, 'Get trades failed');
          }

          throw error;
        }
      },
      getTrade: async tradeId => {
        try {
          const { data: response } = await this.instance.get<GetTradeResponse>(`trades/${tradeId}`);

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get trades failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get trades failed');
          } else {
            this.logger.error(error.message, 'Get trades failed');
          }

          throw error;
        }
      },
    };
  }
}
