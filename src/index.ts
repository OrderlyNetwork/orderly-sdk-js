import 'dotenv/config';

import { ConnectConfig } from 'near-api-js';

import { AssetManagerClient } from './smart-contract/asset-manager.client';
import { NearNetworkId } from './smart-contract/near-network-id.enum';

class OrderlyClient {
  private assetManagerClient: AssetManagerClient;

  constructor(config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    this.checkEnvironment();

    this.assetManagerClient = new AssetManagerClient(config);
  }

  private checkEnvironment() {
    if (!process.env.NETWORK_ID || !Object.keys(NearNetworkId).includes(process.env.NETWORK_ID)) {
      throw Error(
        'NETWORK_ID variable is not set or wrong, please add it to your env file. If you have already done that check its value, which must be one of the following: testnet, mainnet or betanet',
      );
    }

    if (!process.env.ORDERLY_KEY) {
      throw Error('ORDERLY_KEY variable is not set. Please add it to your env file.');
    }

    if (!process.env.ORDERLY_SECRET) {
      throw Error('ORDERLY_SECRET variable is not set. Please add it to your env file.');
    }

    if (!process.env.ORDERLY_ACCOUNT_ID) {
      throw Error('ORDERLY_ACCOUNT_ID variable is not set. Please add it to your env file.');
    }
  }

  get assetManager() {
    return this.assetManagerClient;
  }
}

export default OrderlyClient;
