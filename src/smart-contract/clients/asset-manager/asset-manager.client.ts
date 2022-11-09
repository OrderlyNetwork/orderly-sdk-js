import btoa from 'btoa';
import { ec as EC } from 'elliptic';
import * as fs from 'fs';
import keccak256 from 'keccak256';
import { utils } from 'near-api-js';

import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { NearConfigurationOptions } from '../../../interfaces/configuration/near-configuration-options';
import { DepositParams, StorageWithdrawParams, WithdrawParams } from '../../../interfaces/requests';
import { StorageContractResponse, StorageResponse } from '../../../interfaces/responses';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { AssetManagerContractMethods, AssetManagerContractMethodsList } from './asset-manager.methods';

type AssetManagerStorageType = {
  /**
   * Function to deposit NEAR to the account storage
   *
   * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
   */
  deposit: (amount: number) => Promise<StorageResponse>;

  /**
   * Function to withdraw NEAR from the account storage
   *
   * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
   * If amount is omitted, contract will refund full `available` balance.
   * If `amount` exceeds available balance, it will throw an error.
   */
  withdraw: (amount: number) => Promise<StorageResponse>;

  /**
   * Function to get account storage balance
   */
  balance: () => Promise<StorageResponse>;

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
  constructor(sdkConfiguration: SDKConfigurationOptions, nearConfiguration?: NearConfigurationOptions) {
    super(
      'AssetManagerClient',
      `asset-manager.orderly.${sdkConfiguration.networkId}`,
      AssetManagerContractMethodsList,
      sdkConfiguration,
      nearConfiguration,
    );
  }

  // Private methods
  private async createUserAccount(): Promise<void> {
    this.logger.debug('Create user account is called');

    this.logger.debug('Checking if user account exists');

    const userExists = await this.getContract().user_account_exists({
      args: { user: this.sdkConfig.accountId },
    });

    if (!userExists) {
      this.logger.debug('User account not exists, creating');
      await this.getContract().storage_deposit({
        args: { account_id: this.sdkConfig.accountId, registration_only: true },
        amount: utils.format.parseNearAmount('0.005'),
      });
      this.logger.debug('User account created');
    }

    this.logger.debug('Create user account successfuly executed');
    return;
  }

  private async announceKey(): Promise<void> {
    this.logger.debug('Announce key is called');

    this.logger.debug('Checking if key is already announced');

    const isKeyAnnounced = await this.getContract().is_orderly_key_announced({
      args: {
        user: this.getContract().account.accountId,
        orderly_key: this.sdkConfig.publicKey,
      },
    });

    if (!isKeyAnnounced) {
      this.logger.debug('Key not announced, doing it');
      await this.getContract().user_announce_key({ args: {} });
      this.logger.debug('Key announced');
    }

    this.logger.debug('Announce successfuly executed');
  }

  private async setTradingKey(): Promise<string> {
    this.logger.debug('Set trading key is called');

    this.logger.debug('Checking if trading key is already set');

    const tradingKeyIsSet = await this.getContract().is_trading_key_set({
      args: { user: this.sdkConfig.accountId, orderly_key: this.sdkConfig.publicKey },
    });

    if (tradingKeyIsSet) {
      this.logger.debug('Trading key is already set, requesting it');

      return this.getContract().get_user_trading_key({
        args: { user: this.sdkConfig.accountId, orderly_key: this.sdkConfig.publicKey },
      });
    }

    this.logger.debug('Trading key is not set, generating it');

    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();

    fs.writeFileSync(
      `${__dirname}/.orderly-trading.json`,
      JSON.stringify({ public: keyPair.getPublic(), secret: keyPair.getPrivate() }),
    );

    const publicKey = keyPair.getPublic();
    const pubKeyAsHex = publicKey.encode('hex');

    const normalizeTradingKey = btoa(keccak256(pubKeyAsHex).toString('hex'));

    this.logger.debug('Trading key is generated, setting it');

    const tradingKeyResult = await this.getContract().user_request_set_trading_key({
      args: {
        key: normalizeTradingKey,
      },
    });

    this.logger.debug(tradingKeyResult);

    this.logger.debug('Trading key successfuly set');

    return normalizeTradingKey;
  }

  // Public methods
  /**
   * Function to connect to the contract, authenticate and create credentials file
   *
   * @returns string
   */
  async connect(): Promise<string> {
    this.logger.debug('Connecting to asset manager contract');

    await super._connect();

    this.logger.debug('Successfuly connected to the asset manager contract. Starting authentication flow.');

    await this.createUserAccount();

    await this.announceKey();

    const tradingKey = await this.setTradingKey();

    this.logger.debug('Authentication successful');

    return tradingKey;
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
  deposit(args: DepositParams) {
    return this.getContract().user_deposit_native_token({ args });
  }

  /**
   * Function to withdraw tokens from your account
   *
   * @returns string
   */
  withdraw(args: WithdrawParams) {
    return this.getContract().user_request_withdraw({ args });
  }

  /**
   * Function to check if provided token is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isTokenListed(token: string) {
    return this.getContract().is_token_listed({ args: { token } });
  }

  /**
   * Function to check if provided pair is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isSymbolPairListed(pair: string) {
    return this.getContract().is_symbol_listed({ args: { pair_symbol: pair } });
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

  get storage(): AssetManagerStorageType {
    return {
      deposit: async amount => {
        const response = await this.getContract().storage_deposit({
          args: { account_id: this.sdkConfig.accountId, registration_only: false },
          amount: utils.format.parseNearAmount(amount.toString()),
        });

        return this.toStorageResponse(response);
      },
      withdraw: async amount => {
        const args: StorageWithdrawParams = {};

        if (amount) {
          args.amount = utils.format.parseNearAmount(amount.toString());
        }

        const response = await this.getContract().storage_withdraw({
          args,
          amount: '1',
        });

        return this.toStorageResponse(response);
      },
      balance: async () => {
        const response = await this.getContract().storage_balance_of({
          args: { account_id: this.sdkConfig.accountId },
        });

        return this.toStorageResponse(response);
      },
      unregister: (_force = false) => this.getContract().storage_unregister({ args: {}, amount: '1' }),
    };
  }
}
