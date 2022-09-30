import { RestConfigurationOptions } from './rest-configuration-options';

export interface TradingConfigurationOptions extends RestConfigurationOptions {
  orderlyKey: string;

  orderlySecret: string;

  tradingKey: string;
}
