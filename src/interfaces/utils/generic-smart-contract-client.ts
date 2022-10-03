import { Account, connect, ConnectConfig, KeyPair, keyStores, Near } from 'near-api-js';
import { Contract, ContractMethods } from 'near-api-js/lib/contract';

import { NearNetworkId } from '../../enums/near-network-id.enum';
import { SDKConfigurationOptions } from '../../interfaces/configuration';
import { GenericClient } from './generic-client';

export abstract class GenericSmartContractClient<T> extends GenericClient {
  private networkId: NearNetworkId;
  private near: Near;
  private keyStore: keyStores.InMemoryKeyStore;
  private account: Account;
  private contract: Contract;

  constructor(
    clientName: string,
    private sdkConfig: SDKConfigurationOptions,
    private config: Omit<ConnectConfig, 'keyStore' | 'networkId'>,
    private contractName: string,
    private contractOptions: ContractMethods,
  ) {
    super(clientName, sdkConfig.debug);

    this.networkId = NearNetworkId[this.sdkConfig.networkId];
  }

  protected async _connect() {
    await this.createKeyStore();

    this.near = await connect({
      keyStore: this.keyStore,
      networkId: this.networkId,
      ...this.config,
    });

    this.account = new Account(this.near.connection, this.sdkConfig.accountId);

    this.contract = new Contract(this.account, this.contractName, this.contractOptions);
  }

  private async createKeyStore() {
    const keyPair = KeyPair.fromString(this.sdkConfig.secretKey);

    this.keyStore = new keyStores.InMemoryKeyStore();

    await this.keyStore.setKey(this.networkId, this.sdkConfig.accountId, keyPair);
  }

  protected getContract(): Contract & T {
    return this.contract as Contract & T;
  }
}
