import { CallMethodSignature } from '../../utils';

export interface GetTokens {
  account_id: string;
}

export type GetTokensRequest = CallMethodSignature<GetTokens>;
