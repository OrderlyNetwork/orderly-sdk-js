import 'dotenv/config';

import { ConnectConfig } from 'near-api-js';

import { AssetManagerClient } from './smart-contract/asset-manager.client';

class OrderlyClient {
  private assetManagerClient: AssetManagerClient;

  constructor(config: Omit<ConnectConfig, 'keyStore' | 'networkId'>) {
    this.assetManagerClient = new AssetManagerClient(config);
  }

  get assetManager() {
    return this.assetManagerClient;
  }
}

export default OrderlyClient;
