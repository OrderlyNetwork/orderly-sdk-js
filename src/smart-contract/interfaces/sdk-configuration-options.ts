import { NearNetworkId } from '../enums';

export interface SDKConfigurationOptions {
  networkId?: keyof typeof NearNetworkId;
  accountId?: string;
  publicKey?: string;
  secretKey?: string;
  debug?: boolean;
}
