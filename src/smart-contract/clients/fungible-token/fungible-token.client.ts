import { NearWallet } from '../../../near-wallet';
import { NearNetworkId } from '../../../enums';
import { environment } from '../../enviroment';

export class FungibleTokenClient {
  private accountId: string;
  private wallet: NearWallet;
  private networkId: NearNetworkId;

  constructor(wallet, accountId, networkId) {
    this.wallet = wallet;
    this.accountId = accountId;
    this.networkId = networkId;
  }

  public async getTokens(ftTokenContract) {
    return await this.wallet.callMethod(
      ftTokenContract,
      'get_tokens',
      { account_id: this.accountId },
      '300000000000000',
      '1',
    );
  }

  public async deposit(amount, ftTokenContract) {
    const args = {
      receiver_id: environment(this.networkId).nearWalletConfig.contractName,
      amount: String(amount),
      msg: '',
    };

    return await this.wallet.callMethod(ftTokenContract, 'ft_transfer_call', args, '300000000000000', '1');
  }
}
