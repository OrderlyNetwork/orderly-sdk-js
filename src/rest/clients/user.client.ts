import axios, { AxiosError, AxiosInstance } from 'axios';

import { AccountInformation, HoldingInformation, Transaction } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { GetAssetHistoryRequest } from '../../interfaces/requests';
import {
  GetAccountInformationResponse,
  GetAssetHistoryResponse,
  GetCurrentHoldingResponse,
} from '../../interfaces/responses';
import { FailedApiResponse, GenericClient } from '../../interfaces/utils';

export type AccountType = {
  /**
   * Returns holding summary of the user.
   *
   * @link https://docs-api.orderly.network/#get-current-holding
   */
  getCurrentHolding: (all: boolean) => Promise<HoldingInformation[]>;

  /**
   * Get account information
   *
   * @link https://docs-api.orderly.network/#get-account-information
   */
  getInformation: () => Promise<AccountInformation>;

  /**
   * Get asset history, includes token deposit/withdraw and collateral deposit/withdraw.
   *
   * @link https://docs-api.orderly.network/#get-asset-history
   */
  getAssetHistory: (params?: GetAssetHistoryRequest) => Promise<Transaction[]>;
};

export class AccountClient extends GenericClient {
  private instance: AxiosInstance;

  constructor(private config: AuthorizedConfigurationOptions, debug = false) {
    super('Account REST Client', debug);

    this.instance = axios.create({
      baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
    });
  }

  get account(): AccountType {
    return {
      getCurrentHolding: async all => {
        try {
          const { data: response } = await this.instance.get<GetCurrentHoldingResponse>('client/holding', {
            params: {
              all,
            },
          });

          return response.data.holding;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get current holding failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get current holding failed');
          } else {
            this.logger.error(error.message, 'Get current holding failed');
          }

          throw error;
        }
      },
      getInformation: async () => {
        try {
          const { data: response } = await this.instance.get<GetAccountInformationResponse>('client/info');

          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get account information failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get account information failed');
          } else {
            this.logger.error(error.message, 'Get account information failed');
          }

          throw error;
        }
      },
      getAssetHistory: async params => {
        try {
          const { data: response } = await this.instance.get<GetAssetHistoryResponse>('asset/history', {
            params,
          });

          return response.data.rows;
        } catch (error) {
          if (error instanceof AxiosError) {
            const err = error as AxiosError<FailedApiResponse>;

            if (err.response) {
              const { data } = err.response;

              this.logger.error(`Get asset history failed: ${data.message}`);

              throw new Error(
                JSON.stringify({
                  code: data.code,
                  message: data.message,
                }),
              );
            }

            this.logger.error(err.toJSON(), 'Get asset history failed');
          } else {
            this.logger.error(error.message, 'Get asset history failed');
          }

          throw error;
        }
      },
    };
  }
}
