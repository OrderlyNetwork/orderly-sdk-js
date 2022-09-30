import axios, { AxiosError, AxiosInstance } from 'axios';

import { FeeInformation, SymbolOrderRules, TradeInformation } from '../../entities';
import { RestConfigurationOptions } from '../../interfaces/configuration';
import {
  GetAvailableSymbolsResponse,
  GetFeeInformationResponse,
  GetSymbolOrderRulesResponse,
  GetTradesResponse,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient } from '../../interfaces/utils';

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
  getMarketTrades: (symbol: string, limit: number) => Promise<TradeInformation[] | undefined>;
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
          const { data: response } = await this.instance.get<GetTradesResponse>('public/market_trades', {
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
