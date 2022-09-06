import { Account, connect, ConnectConfig, KeyPair, keyStores, Near } from 'near-api-js';
import { Contract, ContractMethods } from 'near-api-js/lib/contract';

import { NearNetworkId } from './near-network-id.enum';

export abstract class BaseClient<T> {
  private networkId: NearNetworkId;
  private near: Near;
  private keyStore: keyStores.InMemoryKeyStore;
  private account: Account;
  private contract: Contract;

  constructor(
    private config: Omit<ConnectConfig, 'keyStore' | 'networkId'>,
    private contractName: string,
    private contractOptions: ContractMethods,
  ) {
    this.checkVariables();
    this.networkId = NearNetworkId[process.env.NEAR_NETWORK_ID];
  }

  private checkVariables() {
    if (!process.env.NEAR_NETWORK_ID || !Object.keys(NearNetworkId).includes(process.env.NEAR_NETWORK_ID)) {
      throw Error(
        'NEAR_NETWORK_ID variable is not set or wrong, please add it to your env file. If you have already done that check its value, which must be one of the following: testnet, mainnet or betanet',
      );
    }

    if (!process.env.NEAR_PRIVATE_KEY) {
      throw Error('NEAR_PRIVATE_KEY variable is not set. Please add it to your env file.');
    }

    if (!process.env.NEAR_ACCOUNT_ID) {
      throw Error('NEAR_ACCOUNT_ID variable is not set. Please add it to your env file.');
    }
  }

  async connect() {
    await this.createKeyStore();

    this.near = await connect({
      keyStore: this.keyStore,
      networkId: this.networkId,
      ...this.config,
    });

    this.account = new Account(this.near.connection, process.env.NEAR_ACCOUNT_ID);

    this.contract = new Contract(this.account, this.contractName, this.contractOptions);
  }

  private async createKeyStore() {
    const keyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY);

    this.keyStore = new keyStores.InMemoryKeyStore();

    await this.keyStore.setKey(this.networkId, process.env.NEAR_ACCOUNT_ID, keyPair);
  }

  protected getContract(): Contract & T {
    return this.contract as Contract & T;
  }
}
