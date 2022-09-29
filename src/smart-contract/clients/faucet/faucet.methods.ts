import { GetTokensRequest } from '../../../interfaces/requests';

export const FaucetContractMethodsList = {
  viewMethods: [],
  changeMethods: ['get_tokens'],
};

export interface FaucetContractMethods {
  get_tokens: (params: GetTokensRequest) => Promise<any>;
}
