import { RestAPIUrl, RestApiVersion } from '../enums';
import { SDKConfigurationOptions } from '../interfaces/configuration';
import { OrdersClient, OrdersType } from './clients/orders.client';
import { PublicClient, PublicType } from './clients/public.client';

export type RestType = {
  public: PublicType;
  orders: OrdersType;
};

export class RestClient {
  private publicClient: PublicClient;
  private ordersClient: OrdersClient;

  constructor(
    private sdkOptions: SDKConfigurationOptions,
    private tradingKey: string,
    private apiVersion = RestApiVersion.v1,
  ) {
    const apiUrl = RestAPIUrl[sdkOptions.networkId];

    this.publicClient = new PublicClient({ apiUrl, apiVersion: this.apiVersion }, this.sdkOptions.debug);
    this.ordersClient = new OrdersClient(
      {
        apiUrl,
        apiVersion,
        tradingKey: this.tradingKey,
        orderlyKey: this.sdkOptions.publicKey,
        orderlySecret: this.sdkOptions.secretKey,
      },
      this.sdkOptions.debug,
    );
  }

  get rest(): RestType {
    return {
      public: this.publicClient.public,
      orders: this.ordersClient.orders,
    };
  }
}
