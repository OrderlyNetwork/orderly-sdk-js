import { SDKConfigurationOptions } from '../interfaces/configuration';
import { GenericClient } from '../interfaces/utils';
import { AssetManagerClient, AssetManagerType } from './clients/asset-manager/asset-manager.client';
import { FaucetClient, FaucetType } from './clients/faucet/faucet.client';

export type SmartContractType = {
  assetManager: AssetManagerType;
  faucet: FaucetType;
};

export class SmartContractClient extends GenericClient {
  private assetManagerClient: AssetManagerClient;
  private faucetClient: FaucetClient;

  constructor(private config: SDKConfigurationOptions) {
    super('Smart Contract Client', config.debug);
  }

  async connect(): Promise<string> {
    this.assetManagerClient = new AssetManagerClient(this.config, {
      nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
      walletUrl: `https://wallet.${this.config.networkId}.near.org`,
      helperUrl: `https://helper.${this.config.networkId}.near.org`,
      headers: {},
    });

    this.logger.debug('Initialized Asset Manager Client');

    this.faucetClient = new FaucetClient(this.config, {
      nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
      walletUrl: `https://wallet.${this.config.networkId}.near.org`,
      helperUrl: `https://helper.${this.config.networkId}.near.org`,
      headers: {},
    });

    this.logger.debug('Initialized Faucet Client');

    const tradingKey = await this.assetManagerClient.connect();

    await this.faucetClient.connect();

    return tradingKey;
  }

  get smartContract(): SmartContractType {
    if (!this.assetManagerClient || !this.faucetClient) {
      throw new Error('Call connect method, before accessing the API');
    }

    return {
      assetManager: this.assetManagerClient.assetManager,
      faucet: this.faucetClient.faucet,
    };
  }
}
