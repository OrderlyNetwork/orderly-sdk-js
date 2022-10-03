import { CallMethodSignature } from '../utils/call-method-signature';

/**
 * Withdraw call params
 */
export interface WithdrawParams {
  /**
   * Token to withdraw
   */
  token: string;

  /**
   * Amount of tokens to withdraw
   */
  amount: number;
}

export type WithdrawRequest = CallMethodSignature<WithdrawParams>;
