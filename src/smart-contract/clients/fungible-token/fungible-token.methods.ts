import { DepositFungibleTokenRequest, GetTokensRequest } from '../../../interfaces/requests';

export const FungibleTokenContractMethodsList = {
  viewMethods: [],
  changeMethods: ['get_tokens', 'ft_transfer_call'],
};

export interface FungibleTokenContractMethods {
  get_tokens: (params: GetTokensRequest) => Promise<any>;
  ft_transfer_call: (params: DepositFungibleTokenRequest) => Promise<any>;
}
