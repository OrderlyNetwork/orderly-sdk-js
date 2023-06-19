import {
  EmptyRequest,
  StorageDepositRequest,
  StorageUnregisterRequest,
  StorageWithdrawRequest,
  UserKeyRequest,
  WithdrawRequest,
} from '../../../interfaces/requests';
import { StorageContractResponse } from '../../../interfaces/responses';
import { CallMethodSignature } from '../../../interfaces/utils';

export const AssetManagerContractMethodsList = {
  viewMethods: [
    'get_listed_tokens',
    'user_storage_usage',
    'is_token_listed',
    'user_account_exists',
    'storage_balance_of',
    'storage_balance_bounds',
    'is_symbol_listed',
    'get_user_trading_key',
    'is_orderly_key_announced',
    'is_trading_key_set',
    'storage_cost_of_announce_key',
    'get_user_tokens_balances'
  ],
  changeMethods: [
    // Authentication/registration
    'storage_deposit',
    'user_announce_key',
    'user_request_set_trading_key',
    // Deposit
    'user_deposit_native_token',
    // Withdrawal
    'user_request_withdraw',
    'storage_withdraw',
    'storage_unregister',
    // Data access
  ],
};

export interface AssetManagerContractMethods {
  // Authentication/registration
  storage_deposit: (params: StorageDepositRequest) => Promise<StorageContractResponse>;
  user_announce_key: (params: EmptyRequest) => Promise<void>;
  user_request_set_trading_key: (params: CallMethodSignature<{ key: string }>) => Promise<void>;
  // Deposit
  user_deposit_native_token: (params: EmptyRequest) => Promise<void>;
  // Withdrawal
  user_request_withdraw: (params: WithdrawRequest) => Promise<void>;
  storage_withdraw: (params: StorageWithdrawRequest) => Promise<StorageContractResponse>;
  storage_unregister: (params: StorageUnregisterRequest) => Promise<boolean>;
  // Data access
  is_token_listed: ({ token }) => Promise<boolean>;
  get_listed_tokens: (params: EmptyRequest) => Promise<string[]>;
  user_account_exists: (params: CallMethodSignature<{ user: string }>) => Promise<boolean>;
  storage_balance_of: ({ account_id }) => Promise<StorageContractResponse>;
  storage_balance_bounds: (params: CallMethodSignature<{ account_id: string }>) => Promise<unknown>;
  is_symbol_listed: ({ pair_symbol }) => Promise<boolean>;
  get_user_trading_key: (params: UserKeyRequest) => Promise<string>;
  is_orderly_key_announced: (params: UserKeyRequest) => Promise<boolean>;
  is_trading_key_set: (params: UserKeyRequest) => Promise<boolean>;
  user_storage_usage: ({ user }) => Promise<unknown>;
  storage_cost_of_announce_key: (params: EmptyRequest) => Promise<unknown>;
  get_user_tokens_balances: ({ user}) => Promise<unknown>;
}
