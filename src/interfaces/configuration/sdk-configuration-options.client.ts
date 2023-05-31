import { NearNetworkId } from '../../enums';

export interface SdkConfigurationOptionsClient {
  contractId: string;
  networkId?: keyof typeof NearNetworkId; // "testnet" or "mainnet"
  debug?: boolean; // For debug logs. Can be skipped.
}
