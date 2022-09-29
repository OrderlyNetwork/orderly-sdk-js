import { CallMethodSignature } from '../utils/call-method-signature';

export interface UserKeyParams {
  user: string;

  orderly_key: string;
}

export type UserKeyRequest = CallMethodSignature<UserKeyParams>;
