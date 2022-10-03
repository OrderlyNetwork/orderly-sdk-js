import { ConnectConfig } from 'near-api-js';

import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { FaucetContractMethods, FaucetContractMethodsList } from './faucet.methods';

export type FaucetType = {
  getTokens: () => Promise<any>;
};

export class FaucetClient extends GenericSmartContractClient<FaucetContractMethods> {
  constructor(private SDKConfig: SDKConfigurationOptions, config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super('FaucetClient', SDKConfig, config, 'ft-faucet-usdc.orderly.testnet', FaucetContractMethodsList);
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

  get faucet(): FaucetType {
    return {
      getTokens: () => {
        return this.getContract().get_tokens({ args: { account_id: this.SDKConfig.accountId } });
      },
    };
  }
}
