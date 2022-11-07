import { CallMethodSignature } from '../../utils';

/**
 * Deposit call params
 */
export interface DepositParams {
  /**
   * Deposit message (can leave as empty string)
   */
  msg?: string;

  /**
   * Amount of NEAR to deposit
   */
  amount: number;
}

export type DepositRequest = CallMethodSignature<DepositParams>;
