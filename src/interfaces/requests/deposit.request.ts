import { CallMethodSignature } from '../utils/call-method-signature';

/**
 * Deposit call params
 */
export interface DepositParams {
  /**
   * User's Asset Manager account
   */
  receiver_id: string;

  /**
   * Deposit message (can leave as empty string)
   */
  msg?: string;

  /**
   * Amount of NEAR / fungible token to deposit
   */
  amount: number;
}

export type DepositNearRequest = CallMethodSignature<Omit<DepositParams, 'receiver_id' | 'msg'>>;

export type DepositFungibleTokenRequest = CallMethodSignature<DepositParams>;
