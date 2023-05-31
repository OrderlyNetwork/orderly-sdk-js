import { CallMethodSignature } from '../../utils';

/**
 * Storage deposit call params
 */
export interface StorageDepositParams {
  /**
   * Account id
   */
  account_id?: string;

  /**
   * Flag to only register the user
   */
  registration_only?: boolean;
}

export type StorageDepositRequest = CallMethodSignature<StorageDepositParams>;
