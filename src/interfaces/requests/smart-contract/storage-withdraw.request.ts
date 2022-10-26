import { CallMethodSignature } from '../../utils';

/**
 * Storage withdraw call params
 */
export interface StorageWithdrawParams {
  /**
   * Amount of tokens to withdraw
   */
  amount?: string;
}

export type StorageWithdrawRequest = CallMethodSignature<StorageWithdrawParams>;
