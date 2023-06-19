import axios, { AxiosError, AxiosInstance } from 'axios';

import { FeeInformation, SymbolOrderRules, TradeInformation } from '../../entities';
import { RestConfigurationOptions } from '../../interfaces/configuration';
import {
  GetAvailableSymbolsResponse,
  GetFeeInformationResponse,
  GetMarketTradesResponse,
  GetSymbolOrderRulesResponse,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient } from '../../interfaces/utils';
import { FundingRateHistoryOneMarketRequest } from '../../interfaces/requests'

export type PublicType = {
  /**
   * This endpoint provides all the values for the rules that an order need to fulfil in order for it to be placed successfully.
   *
   * @link https://docs-api.orderly.network/#exchange-information
   */
  getSymbolOrderRules: (symbol: string) => Promise<SymbolOrderRules | undefined>;

  /**
   * Get available symbols that Orderly Network supports, and also send order rules for each symbol.
   *
   * @link https://docs-api.orderly.network/#available-symbols-public
   */
  getAvailableSymbols: () => Promise<SymbolOrderRules[] | undefined>;

  /**
   * Get the latest Orderly Network fee structure.
   *
   * @link https://docs-api.orderly.network/#fee-information-public
   */
  getFeeInformation: () => Promise<FeeInformation[] | undefined>;

  /**
   * Get latest market trades.
   *
   * @link https://docs-api.orderly.network/#market-trades-public
   */
  getMarketTrades: (symbol: string, limit?: number) => Promise<TradeInformation[] | undefined>;

  getPredictedFundingRateForAll: () => Promise<any>;
  getPredictedFundingRateForOne: (symbol: string) => Promise<any>;
  getFundingRateHistoryForOneMarket: (params: FundingRateHistoryOneMarketRequest) => Promise<any>;
  getFundingRateHistoryPerHourForOneMarket: (params: FundingRateHistoryOneMarketRequest) => Promise<any>;
  getFuturesInfoForAllMarkets: () => Promise<any>;
  getFuturesForOneMarket: (symbol: string) => Promise<any>;
  getPositionsUnderLiquidation: () => Promise<any>;
  getPositionsUnderLiquidationPerPerpMarket: (symbol: string) => Promise<any>;
  getLiquidatedPositionsInfo: () => Promise<any>;
  getInsuranceFundInfo: () => Promise<any>;
  getFuturesFeeInformation: () => Promise<any>;
 };

export class PublicClient extends GenericClient {
  private instance: AxiosInstance;

  constructor(private config: RestConfigurationOptions, debug = false) {
    super('Public REST Client', debug);

    this.instance = axios.create({
      baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
    });
  }

  get public(): PublicType {
    return {
      getPredictedFundingRateForAll: async () => {
        try {
          const { data: response } = await this.instance.get('public/funding_rates')

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getPredictedFundingRateForAll failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getPredictedFundingRateForAll failed');
          } else {
            this.logger.error(error.message, 'getPredictedFundingRateForAll failed');
          }

          throw error;
        }
      },
      getPredictedFundingRateForOne: async (symbol) => {
        try {
          const { data: response } = await this.instance.get(`public/funding_rate/${symbol}`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getPredictedFundingRateForOne failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getPredictedFundingRateForOne failed');
          } else {
            this.logger.error(error.message, 'getPredictedFundingRateForOne failed');
          }

          throw error;
        }
      },
      getFundingRateHistoryForOneMarket: async (params) => {
        try {
          const { data: response } = await this.instance.get(`public/funding_rate_history`, {params})

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFundingRateHistoryForOneMarket failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFundingRateHistoryForOneMarket failed');
          } else {
            this.logger.error(error.message, 'getFundingRateHistoryForOneMarket failed');
          }

          throw error;
        }
      },
      getFundingRateHistoryPerHourForOneMarket: async (params) => {
        try {
          const { data: response } = await this.instance.get(`public/funding_rate_history_per_hour`, {params})

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFundingRateHistoryPerHourForOneMarket failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFundingRateHistoryPerHourForOneMarket failed');
          } else {
            this.logger.error(error.message, 'getFundingRateHistoryPerHourForOneMarket failed');
          }

          throw error;
        }
      },
      getFuturesInfoForAllMarkets: async () => {
        try {
          const { data: response } = await this.instance.get('public/futures')

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFuturesInfoForAllMarkets failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFuturesInfoForAllMarkets failed');
          } else {
            this.logger.error(error.message, 'getFuturesInfoForAllMarkets failed');
          }

          throw error;
        }
      },
      getFuturesForOneMarket: async symbol => {
        try {
          const { data: response } = await this.instance.get(`public/futures/${symbol}`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFuturesForOneMarket failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFuturesForOneMarket failed');
          } else {
            this.logger.error(error.message, 'getFuturesForOneMarket failed');
          }

          throw error;
        }
      },
      getPositionsUnderLiquidation: async () => {
        try {
          const { data: response } = await this.instance.get(`public/liquidation`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getPositionsUnderLiquidation failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getPositionsUnderLiquidation failed');
          } else {
            this.logger.error(error.message, 'getPositionsUnderLiquidation failed');
          }

          throw error;
        }
      },
      getPositionsUnderLiquidationPerPerpMarket: async symbol => {
        try {
          const { data: response } = await this.instance.get(`public/liquidation/${symbol}`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getPositionsUnderLiquidationPerPerpMarket failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getPositionsUnderLiquidationPerPerpMarket failed');
          } else {
            this.logger.error(error.message, 'getPositionsUnderLiquidationPerPerpMarket failed');
          }

          throw error;
        }
      },
      getLiquidatedPositionsInfo: async () => {
        try {
          const { data: response } = await this.instance.get(`public/liquidated_positions`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getLiquidatedPositionsInfo failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getLiquidatedPositionsInfo failed');
          } else {
            this.logger.error(error.message, 'getLiquidatedPositionsInfo failed');
          }

          throw error;
        }
      },
      getInsuranceFundInfo: async () => {
        try {
          const { data: response } = await this.instance.get(`public/insurancefund`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getInsuranceFundInfo failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getInsuranceFundInfo failed');
          } else {
            this.logger.error(error.message, 'getInsuranceFundInfo failed');
          }

          throw error;
        }
      },
      getFuturesFeeInformation: async () => {
        try {
          const { data: response } = await this.instance.get(`public/fee_futures/program`)

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`getFuturesFeeInformation failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'getFuturesFeeInformation failed');
          } else {
            this.logger.error(error.message, 'getFuturesFeeInformation failed');
          }

          throw error;
        }
      },
      getSymbolOrderRules: async symbol => {
        try {
          const { data: response } = await this.instance.get<GetSymbolOrderRulesResponse>(`public/info/${symbol}`);

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get symbol order rules failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get symbol order rules');
          } else {
            this.logger.error(error.message, 'Get symbol order rules');
          }

          throw error;
        }
      },
      getAvailableSymbols: async () => {
        try {
          const { data: response } = await this.instance.get<GetAvailableSymbolsResponse>('public/info');

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get available symbols failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get available symbols failed');
          } else {
            this.logger.error(error.message, 'Get available symbols failed');
          }

          throw error;
        }
      },
      getFeeInformation: async () => {
        try {
          const { data: response } = await this.instance.get<GetFeeInformationResponse>('fee/program');

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get fee information failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get fee information failed');
          } else {
            this.logger.error(error.message, 'Get fee information failed');
          }

          throw error;
        }
      },
      getMarketTrades: async (symbol, limit = 10) => {
        try {
          const { data: response } = await this.instance.get<GetMarketTradesResponse>('public/market_trades', {
            params: {
              symbol,
              limit,
            },
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
    };
  }
}
