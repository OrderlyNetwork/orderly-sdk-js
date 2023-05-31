import { NearNetworkId } from '../enums';
import { ParameterNotFoundError } from '../errors';
import { SdkConfigurationOptionsClient } from '../interfaces/configuration/sdk-configuration-options.client';
import { SmartContractClient } from '../smart-contract/index';

import * as nearApi from 'near-api-js'

export class AuthClient {
  private smartContractClient: SmartContractClient;
  private config: SdkConfigurationOptionsClient;

  constructor(options?: SdkConfigurationOptionsClient) {
    this.checkEnvironment(options);

    this.smartContractClient = new SmartContractClient(this.config);
  }

  /**
   * There are two possibilities for user authentication in the NEAR
   * First: mostly suitable for back-end usage - provide user accountId and secretKey
   *   (Full access secret key, that can be obtained from NEAR Wallet). In this case user
   *   will be logged in permanently, signOut() will not work. Transactions will be signed dy secretKey,
   *   no need for approvement by wallet. If secretKey not provided - accountId skipped, second case used.
   * Second: authenticate user by web Wallet. For that requestSignIn() should be called. Functions, that
   *   changing contrqct state or user deposit (both storage and Order) will require user approval through
   *   web wallet. In this case web wallet will be opened authomatically, no need for separate call.
   * Get functions, that does not belong to user account are accessible without user authentication.
   */
  private checkEnvironment(config?: SdkConfigurationOptionsClient) {
    const networkId = NearNetworkId[config?.networkId ?? process.env.NETWORK_ID];
    const debugMode = config?.debug === undefined ? true : config?.debug;
    const contractId = config?.contractId;

    if (debugMode) {
      console.log('Debug mode enabled. Disable it by passing `debug: false` into constructor.');
    }

    if (!networkId) {
      throw new ParameterNotFoundError('Network ID');
    }

    // if (!contractId) {
    //   throw new ParameterNotFoundError('Contract ID');
    // }

    this.config = {
      networkId,
      contractId,
      debug: debugMode,
    };
  }

  /**
   * Connects AssetManager to the network
   * This function must be called before start working with other AuthClient functions
   */
  public async connect(): Promise<void> {
    return this.smartContractClient.connect();
  }

  /**
   * Getter for user near account id if user is logged in
   */
  public accountId() {
    return this.smartContractClient.accountId();
  }

  get nearJsApi() {
    return nearApi;
  }

  public publicClient() {
    return this.smartContractClient.publicClient();
  }

  public generateTradingKey() {
    return this.smartContractClient.generateTradingKey();
  }

  public restApi() {
    return this.smartContractClient.sdkClient();
  }

  public ftClient() {
    return this.smartContractClient.ftClient();
  }

  public contractsApi() {
    return this.smartContractClient.contractClient();
  }

  public wsClient() {
    return this.smartContractClient.wsClient();
  }

  /**
   * Return user authentication state
   */
  public async isSignedIn() {
    return this.smartContractClient.isSignedIn();
  }

  /**
   * Request for NEAR web Wallet login
   * Does not work when secretKey is provided
   */
  // public async requestSignIn() {
  //   return this.smartContractClient.requestSignIn();
  // }

  /**
   * Log out user from NEAR web Wallet
   * Does not work when secretKey is provided
   */
  public async signOut() {
    return this.smartContractClient.signOut();
  }

  public async getTransactionOutcomes(txhash: string) {
    return this.smartContractClient.getTransactionOutcomes(txhash);
  }
}
