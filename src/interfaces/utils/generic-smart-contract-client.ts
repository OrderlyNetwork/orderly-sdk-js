import { Account, KeyPair, keyStores, Near } from 'near-api-js';
import { Contract, ContractMethods } from 'near-api-js/lib/contract';

import { NearNetworkId } from '../../enums/near-network-id.enum';
import { SDKConfigurationOptions } from '../../interfaces/configuration';
import { GenericClient } from './generic-client';

export abstract class GenericSmartContractClient<T> extends GenericClient {
  public networkId: NearNetworkId;
  private near: Near;
  private keyStore: keyStores.InMemoryKeyStore;
  private account: Account;
  private contract: Contract;

  constructor(
    clientName: string,
    protected contractName: string,
    protected contractMethods: ContractMethods,
    protected sdkConfig: SDKConfigurationOptions,
    protected nearAccount: any,
    protected managerContract: any,
  ) {
    super(clientName, sdkConfig.debug);

    this.networkId = NearNetworkId[this.sdkConfig.networkId];
  }

  protected async _connect() {
    // await this.createKeyStore();

    this.account = this.nearAccount;

    this.contract = this.managerContract;
  }

  private async createKeyStore() {
    const keyPair = KeyPair.fromString(this.sdkConfig.secretKey);

    this.keyStore = new keyStores.InMemoryKeyStore();

    console.log('this.keyStore', this.keyStore);

    await this.keyStore.setKey(this.networkId, this.sdkConfig.accountId, keyPair);
  }

  protected getContract(): Contract & T {
    return this.contract as Contract & T;
  }
}
