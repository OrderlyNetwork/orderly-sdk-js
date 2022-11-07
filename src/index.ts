import 'dotenv/config';

import pino from 'pino';

import { NearNetworkId } from './enums/near-network-id.enum';
import { ParameterNotFoundError } from './errors';
import { SDKConfigurationOptions } from './interfaces/configuration';
import { getLogger } from './logger';
import { RestClient, RestType } from './rest';
import { SmartContractClient, SmartContractType } from './smart-contract';

class OrderlyClient {
  private smartContractClient: SmartContractClient;
  private restClient: RestClient;

  private config: SDKConfigurationOptions;
  private logger: pino.BaseLogger;

  constructor(options?: SDKConfigurationOptions) {
    this.checkEnvironment(options);

    this.smartContractClient = new SmartContractClient(this.config);
  }

  private checkEnvironment(config?: SDKConfigurationOptions) {
    const networkId = NearNetworkId[config?.networkId ?? process.env.NETWORK_ID];
    const accountId = config?.accountId ?? process.env.ORDERLY_ACCOUNT_ID;
    const publicKey = config?.publicKey ?? process.env.ORDERLY_KEY;
    const secretKey = config?.secretKey ?? process.env.ORDERLY_SECRET;
    const debugMode = config?.debug === undefined ? true : config?.debug;

    this.logger = getLogger('Main Client', debugMode);

    if (debugMode) {
      this.logger.debug('Debug mode enabled. Disable it by passing `debug: false` into constructor.');
    }

    if (!networkId) {
      throw new ParameterNotFoundError('Network ID');
    }

    if (!accountId) {
      throw new ParameterNotFoundError('Account ID');
    }

    if (!publicKey) {
      throw new ParameterNotFoundError('Public key');
    }

    if (!secretKey) {
      throw new ParameterNotFoundError('Secret key');
    }

    this.config = {
      networkId,
      accountId,
      publicKey,
      secretKey,
      debug: debugMode,
    };
  }

  get smartContract(): SmartContractType {
    return this.smartContractClient.smartContract;
  }

  get rest(): RestType {
    if (!this.restClient) {
      this.restClient = new RestClient(this.config);
    }

    return this.restClient.rest;
  }
}

export * as entities from './entities';

export default OrderlyClient;
