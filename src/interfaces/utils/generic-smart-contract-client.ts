import { Account, connect, KeyPair, keyStores, Near } from 'near-api-js';
import { Contract, ContractMethods } from 'near-api-js/lib/contract';

import { NearNetworkId } from '../../enums/near-network-id.enum';
import { SDKConfigurationOptions } from '../../interfaces/configuration';
import { NearConfigurationOptions } from '../configuration/near-configuration-options';
import { GenericClient } from './generic-client';

export abstract class GenericSmartContractClient<T> extends GenericClient {
  private networkId: NearNetworkId;
  private near: Near;
  private keyStore: keyStores.InMemoryKeyStore;
  private account: Account;
  private contract: Contract;

  constructor(
    clientName: string,
    protected contractName: string,
    protected contractMethods: ContractMethods,
    protected sdkConfig: SDKConfigurationOptions,
    protected nearConfig: NearConfigurationOptions = {
      nodeUrl: `https://rpc.${sdkConfig.networkId}.near.org`,
      headers: {},
    },
  ) {
    super(clientName, sdkConfig.debug);

    this.networkId = NearNetworkId[this.sdkConfig.networkId];
  }

  protected async _connect() {
    await this.createKeyStore();

    this.near = await connect({
      keyStore: this.keyStore,
      networkId: this.networkId,
      ...this.nearConfig,
    });

    this.account = new Account(this.near.connection, this.sdkConfig.accountId);

    this.contract = new Contract(this.account, this.contractName, this.contractMethods);
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
