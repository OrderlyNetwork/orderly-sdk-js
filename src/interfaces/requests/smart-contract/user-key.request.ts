import { CallMethodSignature } from '../../utils';

export interface UserKeyParams {
  user: string;

  orderly_key: string;
}

export type UserKeyRequest = CallMethodSignature<UserKeyParams>;
