import { CallMethodSignature } from '../../utils';

/**
 * Deposit call params
 */
export interface DepositFungibleTokenParams {
  /**
   * User's Asset Manager account
   */
  receiver_id: string;

  /**
   * Amount of fungible token to deposit
   */
  amount: string;

  /**
   * Deposit message (can leave as empty string)
   */
  msg?: string;
}

export type DepositFungibleTokenRequest = CallMethodSignature<DepositFungibleTokenParams>;
