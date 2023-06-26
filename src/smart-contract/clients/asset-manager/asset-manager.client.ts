import { utils } from 'near-api-js';

import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { StorageWithdrawParams, WithdrawParams } from '../../../interfaces/requests';
import { StorageContractResponse, StorageResponse } from '../../../interfaces/responses';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { NearWallet } from '../../../near-wallet';
import { environment } from '../../enviroment';
import { AssetManagerContractMethods, AssetManagerContractMethodsList } from './asset-manager.methods';
import { NearNetworkId } from '../../../enums';

type AssetManagerStorageType = {
  /**
   * Function to deposit NEAR to the account storage
   *
   * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
   */
  deposit: (amount: number) => Promise<unknown>;

  /**
   * Function to withdraw NEAR from the account storage
   *
   * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
   * If amount is omitted, contract will refund full `available` balance.
   * If `amount` exceeds available balance, it will throw an error.
   */
  withdraw: (amount: number) => Promise<unknown>;

  /**
   * Function to get account storage balance
   */
  balance: () => Promise<unknown>;

  /**
   * Function to unregister account from the contract
   * and withdraw all deposited fee storage costs
   *
   * Returns `true` if the account was unregistered.
   * Returns `false` if account was not registered before.
   *
   * **This method will be released in next version**
   */
  unregister: (force?: boolean) => Promise<boolean>;
};

export class AssetManagerClient extends GenericSmartContractClient<AssetManagerContractMethods> {
  private wallet: NearWallet;
  constructor(sdkConfiguration: SDKConfigurationOptions, account, contract, wallet) {
    super(
      'AssetManagerClient',
      `asset-manager.orderly.${sdkConfiguration.networkId}`,
      AssetManagerContractMethodsList,
      sdkConfiguration,
      account,
      contract,
    );
    this.wallet = wallet;
  }

  // Public methods
  /**
   * Function to connect to the contract, authenticate and create credentials file
   *
   * @returns string
   */
  async connect(): Promise<void> {
    await super._connect();
  }

  private toStorageResponse(contractResponse: StorageContractResponse): StorageResponse {
    const { total, available } = contractResponse;

    return {
      total: parseFloat(utils.format.formatNearAmount(total, 2)),
      available: parseFloat(utils.format.formatNearAmount(available, 2)),
    };
  }

  /**
   * Function to deposit NEAR to your account
   *
   */
  public async depositNEAR(amount: string | number) {
    return await this.wallet.callMethod(
      environment(this.networkId).nearWalletConfig.contractName,
      'user_deposit_native_token',
      {},
      '30000000000000',
      utils.format.parseNearAmount(amount.toString()),
    );
  }

  public async getUserTokenBalance(accountId = '') {
    return await this.getContract().get_user_tokens_balances({user: accountId ? accountId : this.sdkConfig.accountId})
  }

  /**
   * Function to withdraw tokens from your account
   *
   * @returns string
   */
  public async withdraw(args: WithdrawParams) {
    return await this.wallet.callMethod(
      environment(this.networkId).nearWalletConfig.contractName,
      'user_request_withdraw',
      {token: args.token, amount: String(args.amount)},
      '30000000000000',
      '1',
    );
  }

  /**
   * Function to check if provided token is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isTokenListed(token: string) {
    return this.getContract().is_token_listed({ token });
  }

  /**
   * Function to check if provided pair is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isSymbolPairListed(pair: string) {
    return this.getContract().is_symbol_listed({ pair_symbol: pair });
  }

  /**
   * Function to get all allowed tokens for your account
   * on this contract
   *
   * @returns boolean
   */
  getPossibleTokens() {
    return this.getContract().get_listed_tokens({
      args: {},
    });
  }

  async userRequestSettlement() {
    await this.wallet.callMethod(
      environment(this.networkId).nearWalletConfig.contractName,
      'user_request_settlement',
      {},
      '100000000000000',
      '1',
    );
  }

  storageBalanceOf(accountId) {
    return this.getContract().storage_balance_of({account_id: accountId});
  }

  storageUsageOf(accountId: string) {
    return this.getContract().user_storage_usage({user: accountId});
  }

  get storage(): AssetManagerStorageType {
    return {
      deposit: async amount => {
        await this.wallet.callMethod(
          environment(this.networkId).nearWalletConfig.contractName,
          'storage_deposit',
          { account_id: this.sdkConfig.accountId, registration_only: false },
          '30000000000000',
          utils.format.parseNearAmount(amount.toString()),
        );
      },
      withdraw: async amount => {
        const args: StorageWithdrawParams = {};

        if (amount) {
          args.amount = utils.format.parseNearAmount(amount.toString());
        }

        await this.wallet.callMethod(
          environment(this.networkId).nearWalletConfig.contractName,
          'storage_withdraw',
          args,
          '30000000000000',
          '1',
        );
      },
      balance: async () => {
        const response = await this.getContract().storage_balance_of({ account_id: this.sdkConfig.accountId });

        return this.toStorageResponse(response);
      },
      unregister: () => this.getContract().storage_unregister({ args: {}, amount: '1' }),
    };
  }
}
