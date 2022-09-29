import {
  DepositFungibleTokenRequest,
  DepositNearRequest,
  EmptyRequest,
  UserKeyRequest,
  WithdrawRequest,
} from '../../../interfaces/requests';
import { CallMethodSignature } from '../../../interfaces/utils';

export const AssetManagerContractMethodsList = {
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
};

export interface AssetManagerContractMethods {
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
