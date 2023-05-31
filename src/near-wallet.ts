import { NetworkId, setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { Wallet } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui-js';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { providers } from 'near-api-js';

import { ONE_YOCTO, THIRTY_TGAS } from './constants';
import { environment } from './smart-contract/enviroment';
import { modalStyles } from './style';

export class NearWallet {
  private walletSelector: WalletSelector;
  public wallet: Wallet;
  public nearAccountId: string;
  private createAccessKeyFor: string;
  private readonly network: NetworkId;

  constructor({ contractId, network }) {
    this.createAccessKeyFor = contractId;
    this.network = network;
  }

  get accountId() {
    return this.nearAccountId;
  }

  async startUp(): Promise<boolean> {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [setupNearWallet(), setupMyNearWallet()],
    });
    const isSignedIn = this.walletSelector.isSignedIn();
    console.log('isSignedIn', isSignedIn);

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.nearAccountId = this.walletSelector.store.getState().accounts[0].accountId;
    } else {
      if (document) {
        const style = document.createElement('style');
        style.textContent = modalStyles;
        document.head.appendChild(style);
      }
      const description = 'Please select a wallet to sign in.';
      const modal = setupModal(this.walletSelector, {
        contractId: this.createAccessKeyFor,
        description,
        theme: 'dark',
      });
      modal.show();
    }

    return isSignedIn;
  }

  get isSignedIn(): boolean {
    return this.walletSelector.isSignedIn();
  }

  signOut() {
    this.wallet?.signOut();
    this.wallet = this.nearAccountId = this.createAccessKeyFor = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  async viewMethod(contractId: string, method: string, args: object = {}) {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });
    return res;
  }

  async getAccessKeyInfo(accountId: string, keyPair: any): Promise<any> {
    const provider = new providers.JsonRpcProvider({ url: environment(this.network).nearWalletConfig.nodeUrl });

    const publicKey = keyPair.getPublicKey();
    return provider.query<any>(`access_key/${accountId}/${publicKey.toString()}`, '');
  }

  async callMethod(
    contractId: string,
    method: string,
    args: object = {},
    gas: string = THIRTY_TGAS,
    deposit: string = ONE_YOCTO,
  ) {
    return await this.wallet.signAndSendTransaction({
      signerId: this.nearAccountId,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });
  }

  async getWallet() {
    return this.wallet;
  }

  async getTransactionResult(txhash: string | Uint8Array) {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const transaction = await provider.txStatus(txhash, 'unnused');
    return providers.getTransactionLastResult(transaction);
  }

  async getTransactionOutcomes(txhash: string | Uint8Array) {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const transaction = await provider.txStatus(txhash, 'unnused');
    return transaction.receipts_outcome;
  }
}
