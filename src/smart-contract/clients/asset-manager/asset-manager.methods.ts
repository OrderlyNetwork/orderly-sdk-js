import {
  DepositFungibleTokenRequest,
  DepositNearRequest,
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
  viewMethods: [],
  changeMethods: [
    // Authentication/registration
    'storage_deposit',
    'user_announce_key',
    'user_request_set_trading_key',
    // Deposit
    'user_deposit_native_token',
    'ft_transfer_call',
    // Withdrawal
    'user_request_withdraw',
    'storage_withdraw',
    'storage_unregister',
    // Data access
    'is_token_listed',
    'get_listed_tokens',
    'user_account_exists',
    'storage_balance_of',
    'is_symbol_listed',
    'get_user_trading_key',
    'is_orderly_key_announced',
    'is_trading_key_set',
  ],
};

export interface AssetManagerContractMethods {
  // Authentication/registration
  storage_deposit: (params: StorageDepositRequest) => Promise<StorageContractResponse>;
  user_announce_key: (params: EmptyRequest) => Promise<void>;
  user_request_set_trading_key: (params: CallMethodSignature<{ key: string }>) => Promise<void>;
  // Deposit
  user_deposit_native_token: (params: DepositNearRequest) => Promise<any>;
  ft_transfer_call: (params: DepositFungibleTokenRequest) => Promise<any>;
  // Withdrawal
  user_request_withdraw: (params: WithdrawRequest) => Promise<any>;
  storage_withdraw: (params: StorageWithdrawRequest) => Promise<StorageContractResponse>;
  storage_unregister: (params: StorageUnregisterRequest) => Promise<boolean>;
  // Data access
  is_token_listed: (params: CallMethodSignature<{ token: string }>) => Promise<boolean>;
  get_listed_tokens: (params: EmptyRequest) => Promise<any>;
  user_account_exists: (params: CallMethodSignature<{ user: string }>) => Promise<boolean>;
  storage_balance_of: (params: CallMethodSignature<{ account_id: string }>) => Promise<StorageContractResponse>;
  is_symbol_listed: (params: CallMethodSignature<{ pair_symbol: string }>) => Promise<boolean>;
  get_user_trading_key: (params: UserKeyRequest) => Promise<string>;
  is_orderly_key_announced: (params: UserKeyRequest) => Promise<boolean>;
  is_trading_key_set: (params: UserKeyRequest) => Promise<boolean>;
}
