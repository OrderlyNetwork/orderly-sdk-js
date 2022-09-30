import { RestConfigurationOptions } from './rest-configuration-options';

export interface AuthorizedConfigurationOptions extends RestConfigurationOptions {
  orderlyKey: string;

  orderlySecret: string;

  tradingKey: string;
}
