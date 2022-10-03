import btoa from 'btoa';
import { ec as EC } from 'elliptic';
import keccak256 from 'keccak256';
import { ConnectConfig } from 'near-api-js';

import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { DepositParams, WithdrawParams } from '../../../interfaces/requests';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { AssetManagerContractMethods, AssetManagerContractMethodsList } from './asset-manager.methods';

export type AssetManagerType = {
  /**
   * Function to deposit tokens to your account
   *
   * In order to deposit not native token, pass receiver_id in args for this function
   *
   * @returns void
   */
  deposit: (args: DepositParams) => Promise<any>;

  /**
   * Function to withdraw tokens from your account
   *
   * @returns string
   */
  withdraw: (args: WithdrawParams) => Promise<any>;

  /**
   * Function to check if provided token is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isTokenListed: (token: string) => Promise<boolean>;

  /**
   * Function to check if provided pair is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isSymbolPairListed: (pair: string) => Promise<boolean>;

  /**
   * Function to get all allowed tokens for your account
   * on this contract
   *
   * @returns boolean
   */
  getPossibleTokens: () => Promise<any>;
};

export class AssetManagerClient extends GenericSmartContractClient<AssetManagerContractMethods> {
  constructor(private SDKConfig: SDKConfigurationOptions, config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super(
      'AssetManagerClient',
      SDKConfig,
      config,
      `asset-manager.orderly.${SDKConfig.networkId}`,
      AssetManagerContractMethodsList,
    );
  }

  // Private methods
  private async createUserAccount(): Promise<void> {
    this.logger.debug('Create user account is called');

    this.logger.debug('Checking if user account exists');

    const userExists = await this.getContract().user_account_exists({
      args: { user: this.SDKConfig.accountId },
    });

    if (!userExists) {
      this.logger.debug('User account not exists, creating');
      await this.getContract().create_user_account({ args: {} });
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
        orderly_key: this.SDKConfig.publicKey,
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
      args: { user: this.SDKConfig.accountId, orderly_key: this.SDKConfig.publicKey },
    });

    if (tradingKeyIsSet) {
      this.logger.debug('Trading key is already set, requesting it');

      return this.getContract().get_user_trading_key({
        args: { user: this.SDKConfig.accountId, orderly_key: this.SDKConfig.publicKey },
      });
    }

    this.logger.debug('Trading key is not set, generating it');

    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();

    const publicKey = keyPair.getPublic();
    const pubKeyAsHex = publicKey.encode('hex');

    const normalizeTradingKey = btoa(keccak256(pubKeyAsHex).toString('hex'));

    this.logger.debug('Trading key is generated, setting it');

    await this.getContract().user_request_set_trading_key({
      args: {
        key: normalizeTradingKey,
      },
    });

    this.logger.debug('Trading key successfuly set');

    return normalizeTradingKey;
  }

  // Public methods
  /**
   * Function to connect to the contract, authenticate and return `tradingKey`
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

  get assetManager(): AssetManagerType {
    return {
      deposit: args => {
        return args.receiver_id
          ? this.getContract().ft_transfer_call({
              args,
            })
          : this.getContract().user_deposit_native_token({ args: { amount: args.amount } });
      },
      withdraw: args => {
        return this.getContract().user_request_withdraw({ args });
      },
      isTokenListed: token => {
        return this.getContract().is_token_listed({ args: { token } });
      },
      isSymbolPairListed: pair => {
        return this.getContract().is_symbol_listed({ args: { pair_symbol: pair } });
      },
      getPossibleTokens: () => {
        return this.getContract().get_listed_tokens({
          args: {},
        });
      },
    };
  }
}