import { Buffer } from 'buffer';
import { ec as EC } from 'elliptic';
import keccak256 from 'keccak256';
import { Account, connect, utils } from 'near-api-js';
import { Contract } from 'near-api-js/lib/contract';
import BigNumber from 'bignumber.js';

import { configuration } from '../';
import { SdkConfigurationOptionsClient } from '../interfaces/configuration/sdk-configuration-options.client';
import { GenericClient } from '../interfaces/utils';
import { NearWallet } from '../near-wallet';
import { RestClient } from '../rest';
import { AssetManagerClient } from './clients/asset-manager/asset-manager.client';
import { AssetManagerContractMethodsList } from './clients/asset-manager/asset-manager.methods';
import { FungibleTokenClient } from './clients/fungible-token/fungible-token.client';
import { WebSocketManager } from '../ws/index';
import { environment } from './enviroment';
import { PublicClient } from '../rest/clients/public.client';
import { RestAPIUrl, RestApiVersion } from '../enums';


export class SmartContractClient extends GenericClient {
  private wallet: NearWallet;
  public walletRef: NearWallet;
  private contract: Contract | any;
  private account: Account;
  public sdk: RestClient;
  public sc: AssetManagerClient;
  public ft: FungibleTokenClient;
  public ws: any;

  constructor(private config?: SdkConfigurationOptionsClient) {
    super('Smart Contract Client', config.debug);
  }

  generateTradingKey() {
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const pubKeyAsHex = keyPair.getPublic().encode('hex').replace('04', '')

    return {
      privateKey: keyPair.getPrivate().toString('hex'),
      publicKey: keyPair.getPublic().encode('hex'),
      pubKeyAsHex: pubKeyAsHex,
      normalizeTradingKey: btoa(keccak256(pubKeyAsHex).toString('hex')),
      keyPair,
    };
    }

  async connect(): Promise<void> {
    if (window.Buffer === undefined) window.Buffer = Buffer;
    const nearConfig = environment(this.config.networkId).nearWalletConfig;
    const nearConnection = await connect(nearConfig);

    this.wallet = new NearWallet({ contractId: this.config.contractId, network: this.config.networkId });

    await this.wallet.startUp();

    if (this.wallet.isSignedIn) {
      console.log('Start to init Orderly SDK');
      console.log('this.wallet', this.wallet)
      await nearConnection.account(this.wallet.accountId);
      const accountId = this.wallet.accountId;
      const orderlyKeyPair = await environment(this.config.networkId).nearWalletConfig.keyStore.getKey(
        environment(this.config.networkId).nearWalletConfig.networkId,
        accountId,
      );

      this.account = new Account(nearConnection.connection, accountId);
      this.contract = new Contract(
        this.account,
        environment(this.config.networkId).nearWalletConfig.contractName,
        AssetManagerContractMethodsList,
      );

      const userExists = await this.contract.user_account_exists({ user: accountId });
      this.logger.debug(`userExists: ${userExists}`);

      if (!userExists) {
        this.logger.debug('User account not exists, creating');
        this.wallet.callMethod(
          environment(this.config.networkId).nearWalletConfig.contractName,
          'storage_deposit',
          { account_id: accountId, registration_only: true },
          '30000000000000',
          utils.format.parseNearAmount('1'),
        );
        this.logger.debug('User account created');
      }

      const isKeyAnnounced = await this.contract.is_orderly_key_announced({
        user: accountId,
        orderly_key: orderlyKeyPair.getPublicKey().toString(),
      });

      if (!isKeyAnnounced) {
        
        try {
          const storageCost = await this.contract.storage_cost_of_announce_key({})
          const balanceOf = await this.contract.storage_balance_of({account_id: accountId});
          const storageUsage = await this.contract.user_storage_usage({user: accountId});
          const value = new BigNumber(storageUsage).plus(new BigNumber(storageCost)).minus(new BigNumber(balanceOf.total));

          console.log('storageCost', storageCost)
          console.log('balanceOf', balanceOf)
          console.log('storageUsage', storageUsage)

          if (value.isGreaterThan(0)) {
            this.wallet.callMethod(
              environment(this.config.networkId).nearWalletConfig.contractName,
              'storage_deposit',
              { account_id: accountId, registration_only: false },
              '30000000000000',
              utils.format.parseNearAmount('1'),
            );
          } else {
            this.logger.debug('Key not announced, doing it');
            await this.contract.user_announce_key({});
            this.logger.debug('Key announced');
          }
          
        } catch (e) {
          console.log('ERROR', e);
        }
      }

      const tradingKeyIsSet = await this.contract.is_trading_key_set({
        user: accountId,
        orderly_key: orderlyKeyPair.getPublicKey().toString(),
      });

      let tradingKeyPairResponse;

      if (!tradingKeyIsSet) {
        const getTradingKeyPair = () => {
          const ec = new EC('secp256k1');
          const keyPair = ec.genKeyPair();

          return {
            privateKey: keyPair.getPrivate().toString('hex'),
            publicKey: keyPair.getPublic().encode('hex'),
            keyPair,
          };
        };

        const tradingKeyPair = getTradingKeyPair();
        const pubKeyAsHex = tradingKeyPair.publicKey.replace('04', '');
        const normalizeTradingKey = btoa(keccak256(pubKeyAsHex).toString('hex'));

        this.logger.debug('Trading key is generated, setting it', normalizeTradingKey);

        await this.contract.user_request_set_trading_key({
          key: normalizeTradingKey,
        });

        const tradingKey = localStorage.setItem('TRADING_KEY', tradingKeyPair.publicKey.replace('04', ''));
        const tradingKeySecret = localStorage.setItem('TRADING_KEY_SECRET', tradingKeyPair.privateKey);

        tradingKeyPairResponse = {
          tradingKey: tradingKey,
          tradingKeySecret: tradingKeySecret,
        };
      }

      const sdkOptions: configuration.SDKConfigurationOptions = {
        networkId: this.config.networkId,
        accountId: accountId,
        publicKey: orderlyKeyPair.getPublicKey().toString(),
        // @ts-ignore
        orderlyKeyPrivate: `ed25519:${orderlyKeyPair.secretKey}`,
        tradingPublic: tradingKeyPairResponse?.tradingKey || localStorage.getItem('TRADING_KEY'),
        tradingSecret: tradingKeyPairResponse?.tradingKeySecret || localStorage.getItem('TRADING_KEY_SECRET'),
      };

      this.sdk = new RestClient(sdkOptions);
      this.sc = new AssetManagerClient(sdkOptions, this.account, this.contract, this.wallet);
      this.ft = new FungibleTokenClient(this.wallet, accountId, this.config.networkId);
      this.ws = new WebSocketManager(sdkOptions);
      this.walletRef = this.wallet;
      console.log(this.walletRef);
      await this.sc.connect();
      localStorage.setItem('IS_LOGINED_SDK', 'true')
      console.log('SDK is ready');
    }
  }

  public accountId() {
    return this.walletRef?.nearAccountId;
  }

  public publicClient() {
    const apiUrl = RestAPIUrl[this.config.networkId];
    const apiVersion = RestApiVersion['v1']
    return new PublicClient({ apiUrl, apiVersion: apiVersion}, this.config.debug).public;
  }

  public sdkClient() {
    return this.sdk;
  }

  public wsClient() {
    return this.ws;
  }

  public ftClient() {
    return this.ft;
  }

  public contractClient() {
    return this.sc;
  }

  public isSignedIn() {
    return localStorage.getItem("IS_LOGINED_SDK") === 'true'
  }

  public signOut() {
    localStorage.setItem('IS_LOGINED_SDK', 'false')
    this.walletRef.wallet.signOut();
  }

  public async getTransactionOutcomes(txhash: string) {
    return this.wallet.getTransactionOutcomes(txhash);
  }
}
