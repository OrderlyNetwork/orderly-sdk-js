import { NearNetworkId } from '../enums';

export interface ConnectionOptions {
  networkId: keyof typeof NearNetworkId;
  accountId: string;
  publicKey: string;
  secretKey: string;
}
