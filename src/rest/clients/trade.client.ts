import axios, { AxiosError, AxiosInstance } from 'axios';

import { Kline, OrderTrade } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { GetKlineRequest, GetTradesRequest } from '../../interfaces/requests';
import {
  GetKlineResponse,
  GetOrderTradesResponse,
  GetTradeResponse,
  GetTradesResponse,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient } from '../../interfaces/utils';
import { generateGetHeaders, generatePostHeadersAndRequestData } from '../utils/generateHeaders';
import {
  FundingRateHistoryPrivateRequest,
  FundingRateHistoryOneMarketRequest,
  ClaimLiquidatedPositionRequest,
} from '../../interfaces/requests';
import { LeverageType } from '../../enums/leverage.enum';

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
  getTrades: (params: GetTradesRequest) => Promise<OrderTrade[]>;

  /**
   * Get specific transaction detail by trade id.
   *
   * @link https://docs-api.orderly.network/#get-trade
   */
  getTrade: (tradeId: number) => Promise<OrderTrade>;

  /**
   * Choose maximum leverage for futures mode. Can only be one of 1,2,3,4,5,10
   *
   * @link https://docs-api.orderly.network/#restful-api-private-update-leverage-setting
   */
  setLeverage: (leverage: LeverageType) => Promise<any>;

  getFundingFeeHistory: (params: FundingRateHistoryPrivateRequest) => Promise<any>;
  getAllPositionInfo: () => Promise<any>;
  getOnePositionInfo: (symbol: string) => Promise<any>;
  getLiquidatedPositionsByLiquidator: (params: FundingRateHistoryOneMarketRequest) => Promise<any>;
  getLiquidatedPositionsOfAccount: (params: FundingRateHistoryPrivateRequest) => Promise<any>;
  claimLiquidatedPosition: (params: ClaimLiquidatedPositionRequest) => Promise<any>;
};

export class TradeClient extends GenericClient {
  private instance: AxiosInstance;

  constructor(
    private config: AuthorizedConfigurationOptions,
    private accountId: string,
    debug = false,
  ) {
    super('Trade REST Client', debug);

    this.instance = axios.create({
      baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
    });
  }

  get trade(): TradeType {
    return {
      getKline: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/kline',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            true,
          );

          const { data: response } = await this.instance.get<GetKlineResponse>('kline', {
            params,
            headers,
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
          const headers = await generateGetHeaders(
            'GET',
            `/v1/order/${orderId}/trades`,
            null,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
          );

          const { data: response } = await this.instance.get<GetOrderTradesResponse>(`order/${orderId}/trades`, {
            headers,
          });

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
      getFundingFeeHistory: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/funding_fee/history',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            params ? true : false,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>('funding_fee/history', {
            params,
            headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFundingFeeHistory failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFundingFeeHistory failed');
          } else {
            this.logger.error(error.message, 'getFundingFeeHistory failed');
          }

          throw error;
        }
      },
      getAllPositionInfo: async () => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/positions',
            null,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>('positions', {
            headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getAllPositionInfo failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getAllPositionInfo failed');
          } else {
            this.logger.error(error.message, 'getAllPositionInfo failed');
          }

          throw error;
        }
      },
      getOnePositionInfo: async symbol => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            `/v1/position/${symbol}`,
            null,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>(`position/${symbol}`, {
            headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getOnePositionInfo failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getOnePositionInfo failed');
          } else {
            this.logger.error(error.message, 'getOnePositionInfo failed');
          }

          throw error;
        }
      },
      getLiquidatedPositionsByLiquidator: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/client/liquidator_liquidations',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            true,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>('client/liquidator_liquidations', {
            params,
            headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getLiquidatedPositionsByLiquidator failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getLiquidatedPositionsByLiquidator failed');
          } else {
            this.logger.error(error.message, 'getLiquidatedPositionsByLiquidator failed');
          }

          throw error;
        }
      },
      getLiquidatedPositionsOfAccount: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/liquidations',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            params ? true : false,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>('liquidations', {
            params,
            headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFundingFeeHistory failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFundingFeeHistory failed');
          } else {
            this.logger.error(error.message, 'getFundingFeeHistory failed');
          }

          throw error;
        }
      },
      claimLiquidatedPosition: async params => {
        try {
          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'POST',
            '/v1/liquidation',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
          );
          const { data: response } = await this.instance.post('liquidation', requestData, {
            headers: headers,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`claimLiquidatedPosition failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'claimLiquidatedPosition failed');
          } else {
            this.logger.error(error.message, 'claimLiquidatedPosition failed');
          }

          throw error;
        }
      },
      getTrades: async params => {
        try {
          const headers = await generateGetHeaders(
            'GET',
            '/v1/trades',
            params,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            true,
          );
          const { data: response } = await this.instance.get<GetTradesResponse>('trades', {
            params,
            headers,
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
          const headers = await generateGetHeaders(
            'GET',
            `/v1/trade/${tradeId}`,
            null,
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
          );
          const { data: response } = await this.instance.get<GetTradeResponse>(`trade/${tradeId}`, { headers });

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
      setLeverage: async leverage => {
        try {
          const { headers, requestData } = await generatePostHeadersAndRequestData(
            'POST',
            '/v1/client/leverage',
            { leverage },
            this.config.orderlyKeyPrivate,
            this.accountId,
            this.config.orderlyKey,
            this.config.tradingSecret,
            this.config.tradingPublic,
          );
          const { data: response } = await this.instance.post('/client/leverage', requestData, {
            headers: headers,
          });

          return response;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`setLeverage failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'setLeverage failed');
          } else {
            this.logger.error(error.message, 'setLeverage failed');
          }
          throw error;
        }
      },
    };
  }
}
