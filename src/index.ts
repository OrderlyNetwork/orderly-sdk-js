import 'dotenv/config';

import pino from 'pino';

import { getLogger } from './logger';
import { AssetManagerClient } from './smart-contract/asset-manager.client';
import { NearNetworkId } from './smart-contract/enums/near-network-id.enum';
import { ParameterNotFoundError } from './smart-contract/errors';
import { FaucetClient } from './smart-contract/faucet.client';
import { SDKConfigurationOptions } from './smart-contract/interfaces';

class OrderlyClient {
  private assetManagerClient: AssetManagerClient;
  private faucetClient: FaucetClient;

  private config: SDKConfigurationOptions;
  private logger: pino.BaseLogger;

  constructor(options?: SDKConfigurationOptions) {
    this.checkEnvironment(options);
  }

  private checkEnvironment(config?: SDKConfigurationOptions) {
    const networkId = NearNetworkId[config?.networkId ?? process.env.NETWORK_ID];
    const accountId = config?.accountId ?? process.env.ORDERLY_ACCOUNT_ID;
    const publicKey = config?.publicKey ?? process.env.ORDERLY_KEY;
    const secretKey = config?.secretKey ?? process.env.ORDERLY_SECRET;
    const debugMode = config?.debug === undefined ? true : config?.debug;

    this.logger = getLogger('Main Client', debugMode);

    if (debugMode) {
      this.logger.debug('Debug mode enabled. Disable it by passing `debug: false` into constructor.');
    }

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
      debug: debugMode,
    };
  }

  async connect(): Promise<void> {
    this.assetManagerClient = new AssetManagerClient(this.config, {
      nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
      walletUrl: `https://wallet.${this.config.networkId}.near.org`,
      helperUrl: `https://helper.${this.config.networkId}.near.org`,
      headers: {},
    });

    this.logger.debug('Initialized Asset Manager Client');

    this.faucetClient = new FaucetClient(this.config, {
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      headers: {},
    });

    this.logger.debug('Initialized Faucet Client');

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
