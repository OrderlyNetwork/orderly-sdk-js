import { ConnectConfig } from 'near-api-js';
import pino from 'pino';

import { getLogger } from '../logger';
import { BaseClient } from './base.client';
import { SDKConfigurationOptions } from './interfaces';
import { GetTokensRequest } from './interfaces/requests';

interface FaucetContractMethods {
  get_tokens: (params: GetTokensRequest) => Promise<any>;
}

export class FaucetClient extends BaseClient<FaucetContractMethods> {
  private logger: pino.BaseLogger;

  constructor(private SDKConfig: SDKConfigurationOptions, config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super(SDKConfig, config, 'ft-faucet-usdc.orderly.testnet', {
      viewMethods: [],
      changeMethods: ['get_tokens'],
    });

    this.logger = getLogger('FaucetClient', this.SDKConfig.debug);
  }

  /**
   * Function to connect to the contract
   *
   * @returns string
   */
  async connect(): Promise<void> {
    await super._connect();
    this.logger.debug('Successfuly connected to the faucet manager contract');
  }

  getTokens(): Promise<any> {
    return this.getContract().get_tokens({ args: { account_id: this.SDKConfig.accountId } });
  }
}
