import { CallMethodSignature } from '../utils/call-method-signature';

/**
 * Storage deposit call params
 */
export interface StorageDepositParams {
  /**
   * Account id
   */
  account_id: string;

  /**
   * Flag to only register the user
   */
  registration_only: boolean;
}

export type StorageDepositRequest = CallMethodSignature<StorageDepositParams>;
