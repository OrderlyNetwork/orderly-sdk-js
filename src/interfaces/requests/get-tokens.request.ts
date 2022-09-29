import { CallMethodSignature } from '../utils/call-method-signature';

export interface GetTokens {
  account_id: string;
}

export type GetTokensRequest = CallMethodSignature<GetTokens>;
