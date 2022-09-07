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
    this.networkId = NearNetworkId[process.env.NETWORK_ID];
  }

  async connect() {
    await this.createKeyStore();

    this.near = await connect({
      keyStore: this.keyStore,
      networkId: this.networkId,
      ...this.config,
    });

    this.account = new Account(this.near.connection, process.env.ORDERLY_ACCOUNT_ID);

    this.contract = new Contract(this.account, this.contractName, this.contractOptions);
  }

  private async createKeyStore() {
    const keyPair = KeyPair.fromString(process.env.ORDERLY_SECRET);

    this.keyStore = new keyStores.InMemoryKeyStore();

    await this.keyStore.setKey(this.networkId, process.env.ORDERLY_ACCOUNT_ID, keyPair);
  }

  protected getContract(): Contract & T {
    return this.contract as Contract & T;
  }
}
