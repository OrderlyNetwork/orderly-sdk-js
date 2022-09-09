import 'dotenv/config';

import { AssetManagerClient } from './smart-contract/asset-manager.client';
import { NearNetworkId } from './smart-contract/enums/near-network-id.enum';
import { ParameterNotFoundError } from './smart-contract/errors';
import { FaucetClient } from './smart-contract/faucet.client';
import { SDKConfigurationOptions } from './smart-contract/interfaces';

class OrderlyClient {
  private assetManagerClient: AssetManagerClient;
  private faucetClient: FaucetClient;

  private config: SDKConfigurationOptions;

  constructor(options?: SDKConfigurationOptions) {
    this.checkEnvironment(options);
  }

  private checkEnvironment(config?: SDKConfigurationOptions) {
    const networkId = NearNetworkId[config?.networkId ?? process.env.NETWORK_ID];
    const accountId = config?.accountId ?? process.env.ORDERLY_ACCOUNT_ID;
    const publicKey = config?.publicKey ?? process.env.ORDERLY_KEY;
    const secretKey = config?.secretKey ?? process.env.ORDERLY_SECRET;

    if (!networkId) {
      throw new ParameterNotFoundError('Network ID');
    }

    if (!accountId) {
      throw new ParameterNotFoundError('Account ID');
    }

    if (!publicKey) {
      throw new ParameterNotFoundError('Public key');
    }

    if (!secretKey) {
      throw new ParameterNotFoundError('Secret key');
    }

    this.config = {
      networkId,
      accountId,
      publicKey,
      secretKey,
    };
  }

  async connect(): Promise<void> {
    this.assetManagerClient = new AssetManagerClient(this.config, {
      nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
      walletUrl: `https://wallet.${this.config.networkId}.near.org`,
      helperUrl: `https://helper.${this.config.networkId}.near.org`,
      headers: {},
    });

    this.faucetClient = new FaucetClient(this.config, {
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      headers: {},
    });

    /* const tradingKey = */ await this.assetManagerClient.connect();

    await this.faucetClient.connect();

    // this.rest = new RestClient(tradingKey);
  }

  get assetManager() {
    if (!this.assetManagerClient) {
      throw new Error('Call connect method, before accessing the API');
    }

    return this.assetManagerClient;
  }

  get faucet() {
    if (!this.faucetClient) {
      throw new Error('Call connect method, before accessing the API');
    }

    return this.faucetClient;
  }
}

export default OrderlyClient;
