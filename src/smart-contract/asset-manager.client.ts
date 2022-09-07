import btoa from 'btoa';
import { ec as EC } from 'elliptic';
import keccak256 from 'keccak256';
import { ConnectConfig } from 'near-api-js';

import { BaseClient } from './base.client';
import { CallMethodSignature } from './call-method-signature';

interface AssetManagerContractMethods {
  // Authentication/registration
  user_account_exists: (params: CallMethodSignature<{ user: string }>) => Promise<boolean>;
  create_user_account: (params: CallMethodSignature<Record<string, never>>) => Promise<void>;
  is_orderly_key_announced: (params: CallMethodSignature<{ user: string; orderly_key: string }>) => Promise<boolean>;
  user_announce_key: (params: CallMethodSignature<Record<string, never>>) => Promise<void>;
  is_trading_key_set: (params: CallMethodSignature<{ user: string; orderly_key: string }>) => Promise<boolean>;
  user_request_set_trading_key: (params: CallMethodSignature<{ key: string }>) => Promise<void>;
  // Deposit
  user_deposit_native_token: (params: CallMethodSignature<{ amount: number }>) => Promise<any>;
  ft_transfer_call: (
    params: CallMethodSignature<{ receiver_id: string; msg?: string; amount: number }>,
  ) => Promise<any>;
  // Withdrawal
  user_request_withdraw: (params: CallMethodSignature<{ token: string; amount: number }>) => Promise<any>;
  // Data access
  is_token_listed: (params: CallMethodSignature<{ token: string }>) => Promise<boolean>;
  get_listed_tokens: (params: CallMethodSignature<Record<string, never>>) => Promise<any>;
  is_symbol_listed: (params: CallMethodSignature<{ pair_symbol: string }>) => Promise<boolean>;
  get_user_trading_key: (params: CallMethodSignature<{ user: string; orderly_key: string }>) => Promise<string>;
}

export class AssetManagerClient extends BaseClient<AssetManagerContractMethods> {
  constructor(config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    super(config, `asset-manager.orderly.${process.env.NETWORK_ID}`, {
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
  }

  async createUserAccount(): Promise<void> {
    const userExists = await this.getContract().user_account_exists({
      args: { user: this.getContract().account.accountId },
    });

    if (!userExists) {
      return this.getContract().create_user_account({ args: {} });
    }
  }

  async announceKey(): Promise<void> {
    const isKeyAnnounced = await this.getContract().is_orderly_key_announced({
      args: {
        user: this.getContract().account.accountId,
        orderly_key: process.env.ORDERLY_KEY,
      },
    });

    if (!isKeyAnnounced) {
      return this.getContract().user_announce_key({ args: {} });
    }
  }

  async setTradingKey(): Promise<{ publicKey: string; privateKey: string; tradingKey: string }> {
    const tradingKeyIsSet = await this.getContract().is_trading_key_set({
      args: { user: this.getContract().account.accountId, orderly_key: process.env.ORDERLY_KEY },
    });

    if (tradingKeyIsSet) {
      return;
    }

    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();

    const publicKey = keyPair.getPublic();
    const pubKeyAsHex = publicKey.encode('hex');

    const normalizeTradingKey = btoa(keccak256(pubKeyAsHex).toString('hex'));

    await this.getContract().user_request_set_trading_key({
      args: {
        key: normalizeTradingKey,
      },
    });

    return {
      publicKey: pubKeyAsHex,
      privateKey: keyPair.getPrivate().encode('hex'),
      tradingKey: normalizeTradingKey,
    };
  }

  deposit(amount: number, receiverId?: string, msg?: string): Promise<any> {
    return receiverId
      ? this.getContract().ft_transfer_call({
          args: {
            amount,
            receiver_id: receiverId,
            msg,
          },
        })
      : this.getContract().user_deposit_native_token({ args: { amount } });
  }

  withdraw(token: string, amount: number): Promise<any> {
    return this.getContract().user_request_withdraw({ args: { token, amount } });
  }

  isTokenListed(token: string): Promise<boolean> {
    return this.getContract().is_token_listed({ args: { token } });
  }

  isSymbolPairListed(pair: string): Promise<boolean> {
    return this.getContract().is_symbol_listed({ args: { pair_symbol: pair } });
  }

  getPossibleTokens(): Promise<any> {
    return this.getContract().get_listed_tokens({
      args: {},
    });
  }
}
