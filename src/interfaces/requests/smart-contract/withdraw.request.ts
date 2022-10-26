import { CallMethodSignature } from '../../utils';
import { StorageWithdrawParams } from './storage-withdraw.request';

/**
 * Withdraw call params
 */
export interface WithdrawParams extends StorageWithdrawParams {
  /**
   * Token to withdraw
   */
  token: string;
}

export type WithdrawRequest = CallMethodSignature<WithdrawParams>;
