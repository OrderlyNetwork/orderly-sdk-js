import btoa from 'btoa';
import { ec as EC } from 'elliptic';
import keccak256 from 'keccak256';
import { ConnectConfig } from 'near-api-js';
import pino from 'pino';

import { getLogger } from '../logger';
import { BaseClient } from './base.client';
import { SDKConfigurationOptions } from './interfaces';
import { CallMethodSignature } from './interfaces/call-method-signature';
import {
  DepositFungibleTokenRequest,
  DepositNearRequest,
  DepositParams,
  EmptyRequest,
  UserKeyRequest,
  WithdrawParams,
  WithdrawRequest,
} from './interfaces/requests';

interface AssetManagerContractMethods {
  // Authentication/registration
  user_account_exists: (params: CallMethodSignature<{ user: string }>) => Promise<boolean>;
  create_user_account: (params: EmptyRequest) => Promise<void>;
  is_orderly_key_announced: (params: UserKeyRequest) => Promise<boolean>;
  user_announce_key: (params: EmptyRequest) => Promise<void>;
  is_trading_key_set: (params: UserKeyRequest) => Promise<boolean>;
  user_request_set_trading_key: (params: CallMethodSignature<{ key: string }>) => Promise<void>;
  // Deposit
  user_deposit_native_token: (params: DepositNearRequest) => Promise<any>;
  ft_transfer_call: (params: DepositFungibleTokenRequest) => Promise<any>;
  // Withdrawal
  user_request_withdraw: (params: WithdrawRequest) => Promise<any>;
  // Data access
  is_token_listed: (params: CallMethodSignature<{ token: string }>) => Promise<boolean>;
  get_listed_tokens: (params: EmptyRequest) => Promise<any>;
  is_symbol_listed: (params: CallMethodSignature<{ pair_symbol: string }>) => Promise<boolean>;
  get_user_trading_key: (params: UserKeyRequest) => Promise<string>;
}

export class AssetManagerClient extends BaseClient<AssetManagerContractMethods> {
  private logger: pino.BaseLogger;

  constructor(private SDKConfig: SDKConfigurationOptions, config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super(SDKConfig, config, `asset-manager.orderly.${SDKConfig.networkId}`, {
      viewMethods: [],
      changeMethods: [
        // Authentication/registration
        'user_account_exists',
        'create_user_account',
        'is_orderly_key_announced',
        'user_announce_key',
        'is_trading_key_set',
        'user_request_set_trading_key',
        // Deposit
        'user_deposit_native_token',
        'ft_transfer_call',
        // Withdrawal
        'user_request_withdraw',
        // Data access
        'is_token_listed',
        'get_listed_tokens',
        'is_symbol_listed',
        'get_user_trading_key',
      ],
    });

    this.logger = getLogger('AssetManagerClient', this.SDKConfig.debug);
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

  /**
   * Function to deposit tokens to your account
   *
   * In order to deposit not native token, pass receiver_id in args for this function
   *
   * @returns void
   */
  deposit(args: DepositParams): Promise<any> {
    return args.receiver_id
      ? this.getContract().ft_transfer_call({
          args,
        })
      : this.getContract().user_deposit_native_token({ args: { amount: args.amount } });
  }

  /**
   * Function to withdraw tokens from your account
   *
   * @returns string
   */
  withdraw(args: WithdrawParams): Promise<any> {
    return this.getContract().user_request_withdraw({ args });
  }

  /**
   * Function to check if provided token is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isTokenListed(token: string): Promise<boolean> {
    return this.getContract().is_token_listed({ args: { token } });
  }

  /**
   * Function to check if provided pair is allowed for your account
   * on this contract
   *
   * @returns boolean
   */
  isSymbolPairListed(pair: string): Promise<boolean> {
    return this.getContract().is_symbol_listed({ args: { pair_symbol: pair } });
  }

  /**
   * Function to get all allowed tokens for your account
   * on this contract
   *
   * @returns boolean
   */
  getPossibleTokens(): Promise<any> {
    return this.getContract().get_listed_tokens({
      args: {},
    });
  }
}
