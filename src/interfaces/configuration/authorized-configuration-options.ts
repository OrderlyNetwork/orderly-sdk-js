import { RestConfigurationOptions } from './rest-configuration-options';

export interface AuthorizedConfigurationOptions extends RestConfigurationOptions {
  orderlyKey: string;

  orderlySecret: string;

  orderlyKeyPrivate: string;

  tradingSecret: string;

  tradingPublic: string;
}
