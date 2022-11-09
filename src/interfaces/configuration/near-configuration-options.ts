import { ConnectConfig } from 'near-api-js';

export type NearConfigurationOptions = Omit<ConnectConfig, 'keyStore' | 'networkId'>;
