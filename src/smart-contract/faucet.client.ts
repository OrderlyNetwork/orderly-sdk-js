import { ConnectConfig } from 'near-api-js';

import { BaseClient } from './base.client';
import { SDKConfigurationOptions } from './interfaces';
import { GetTokensRequest } from './interfaces/requests';

interface FaucetContractMethods {
  get_tokens: (params: GetTokensRequest) => Promise<any>;
}

export class FaucetClient extends BaseClient<FaucetContractMethods> {
  constructor(private SDKConfig: SDKConfigurationOptions, config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super(SDKConfig, config, 'ft-faucet-usdc.orderly.testnet', {
      viewMethods: [],
      changeMethods: ['get_tokens'],
    });
  }

  /**
   * Function to connect to the contract
   *
   * @returns string
   */
  async connect(): Promise<void> {
    await super._connect();
  }

  getTokens(): Promise<any> {
    return this.getContract().get_tokens({ args: { account_id: this.SDKConfig.accountId } });
  }
}
