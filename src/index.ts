import 'dotenv/config';

import { AssetManagerClient } from './smart-contract/asset-manager.client';
import { NearNetworkId } from './smart-contract/enums/near-network-id.enum';
import { ParameterNotFoundError } from './smart-contract/errors';
import { ConnectionOptions } from './smart-contract/interfaces';

class OrderlyClient {
  private assetManagerClient: AssetManagerClient;

  private networkId: NearNetworkId;
  private accountId: string;
  private publicKey: string;
  private secretKey: string;

  constructor(options?: ConnectionOptions) {
    this.checkEnvironment(options);
  }

  private checkEnvironment(options?: ConnectionOptions) {
    this.networkId = NearNetworkId[options.networkId ?? process.env.NETWORK_ID];
    this.accountId = options.accountId ?? process.env.ORDERLY_ACCOUNT_ID;
    this.publicKey = options.publicKey ?? process.env.ORDERLY_KEY;
    this.secretKey = options.secretKey ?? process.env.ORDERLY_SECRET;

    if (!this.networkId) {
      throw new ParameterNotFoundError('Network ID');
    }

    if (!this.accountId) {
      throw new ParameterNotFoundError('Account ID');
    }

    if (!this.publicKey) {
      throw new ParameterNotFoundError('Public key');
    }

    if (!this.secretKey) {
      throw new ParameterNotFoundError('Secret key');
    }
  }

  async connect(): Promise<void> {
    this.assetManagerClient = new AssetManagerClient({
      nodeUrl: `https://rpc.${process.env.NETWORK_ID}.near.org`,
      walletUrl: `https://wallet.${process.env.NETWORK_ID}.near.org`,
      helperUrl: `https://helper.${process.env.NETWORK_ID}.near.org`,
      headers: {},
    });

    /* const tradingKey = */ await this.assetManagerClient.connect();

    // this.rest = new RestClient(tradingKey);
  }

  get assetManager() {
    if (!this.assetManagerClient) {
      throw new Error('Call connect method, before accessing the API');
    }

    return this.assetManagerClient;
  }
}

export default OrderlyClient;
