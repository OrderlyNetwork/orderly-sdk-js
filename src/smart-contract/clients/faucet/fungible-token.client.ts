import { ConnectConfig, utils } from 'near-api-js';

import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { DepositFungibleTokenParams } from '../../../interfaces/requests';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { FungibleTokenContractMethods, FungibleTokenContractMethodsList } from './fungible-token.methods';

export type FungibleTokenType = {
  getTokens: () => Promise<any>;
  deposit: (params: DepositFungibleTokenParams) => Promise<any>;
};

export class FungibleTokenClient extends GenericSmartContractClient<FungibleTokenContractMethods> {
  constructor(
    private SDKConfig: SDKConfigurationOptions,
    config: Omit<ConnectConfig, 'keyStore' | 'networkId'>,
    protected address: string,
  ) {
    super(`FungibleTokenClient:${address}`, SDKConfig, config, address, FungibleTokenContractMethodsList);
  }

  /**
   * Function to connect to the contract
   *
   * @returns string
   */
  async connect(): Promise<void> {
    await super._connect();
    this.logger.debug(`Successfuly connected to the fungible token contract on address: ${this.address}`);
  }

  get fungibleToken(): FungibleTokenType {
    return {
      getTokens: () => {
        return this.getContract().get_tokens({ args: { account_id: this.SDKConfig.accountId } });
      },
      deposit: params => this.getContract().ft_transfer_call({ args: params, amount: '1', gas: '300000000000000' }),
    };
  }
}
