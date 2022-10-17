import { CallMethodSignature } from '../utils/call-method-signature';

/**
 * Storage withdraw call params
 */
export interface StorageWithdrawParams {
  /**
   * Amount of tokens to withdraw
   */
  amount: number;
}

export type StorageWithdrawRequest = CallMethodSignature<StorageWithdrawParams>;
