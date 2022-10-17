import { CallMethodSignature } from '../utils/call-method-signature';

/**
 * Storage unregister call params
 */
export interface StorageUnregisterParams {
  /**
   * Flag to force unregister
   */
  force: boolean;
}

export type StorageUnregisterRequest = CallMethodSignature<StorageUnregisterParams>;
