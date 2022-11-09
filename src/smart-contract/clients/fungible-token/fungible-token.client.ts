import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { NearConfigurationOptions } from '../../../interfaces/configuration/near-configuration-options';
import { DepositFungibleTokenParams } from '../../../interfaces/requests';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { FungibleTokenContractMethods, FungibleTokenContractMethodsList } from './fungible-token.methods';

export class FungibleTokenClient extends GenericSmartContractClient<FungibleTokenContractMethods> {
  constructor(
    protected contractUrl: string,
    sdkConfig: SDKConfigurationOptions,
    nearConfig?: NearConfigurationOptions,
  ) {
    super(`FungibleTokenClient:${contractUrl}`, contractUrl, FungibleTokenContractMethodsList, sdkConfig, nearConfig);
  }

  /**
   * Function to connect to the contract
   *
   * @returns string
   */
  async connect(): Promise<void> {
    await super._connect();
    this.logger.debug(`Successfuly connected to the fungible token contract on address: ${this.contractUrl}`);
  }

  getTokens() {
    return this.getContract().get_tokens({ args: { account_id: this.sdkConfig.accountId } });
  }

  deposit(params: DepositFungibleTokenParams) {
    return this.getContract().ft_transfer_call({ args: params, amount: '1', gas: '300000000000000' });
  }
}
