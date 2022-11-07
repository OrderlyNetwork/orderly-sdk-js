import { SDKConfigurationOptions } from '../interfaces/configuration';
import { GenericClient } from '../interfaces/utils';
import { AssetManagerClient, AssetManagerType } from './clients/asset-manager/asset-manager.client';
import { FungibleTokenClient, FungibleTokenType } from './clients/faucet/fungible-token.client';

export type SmartContractType = {
  assetManager: () => Promise<AssetManagerType>;
  fungibleToken: (contractUrl: string) => Promise<FungibleTokenType>;
};

export class SmartContractClient extends GenericClient {
  private assetManagerClient: AssetManagerClient;
  private fungibleTokenClients: Record<string, FungibleTokenClient> = {};

  constructor(private config: SDKConfigurationOptions) {
    super('Smart Contract Client', config.debug);
  }

  get smartContract(): SmartContractType {
    return {
      assetManager: async () => {
        if (!this.assetManagerClient) {
          this.assetManagerClient = new AssetManagerClient(this.config, {
            nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
            walletUrl: `https://wallet.${this.config.networkId}.near.org`,
            helperUrl: `https://helper.${this.config.networkId}.near.org`,
            headers: {},
          });

          this.logger.debug('Initialized Asset Manager Client');

          await this.assetManagerClient.connect();
        }

        return this.assetManagerClient.assetManager;
      },
      fungibleToken: async contractUrl => {
        let client = this.fungibleTokenClients[contractUrl];

        if (!client) {
          client = new FungibleTokenClient(
            this.config,
            {
              nodeUrl: `https://rpc.${this.config.networkId}.near.org`,
              walletUrl: `https://wallet.${this.config.networkId}.near.org`,
              helperUrl: `https://helper.${this.config.networkId}.near.org`,
              headers: {},
            },
            contractUrl,
          );

          await client.connect();

          this.fungibleTokenClients[contractUrl] = client;
        }

        return client.fungibleToken;
      },
    };
  }
}
