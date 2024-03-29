import { RestAPIUrl, RestApiVersion } from '../enums';
import { SDKConfigurationOptions } from '../interfaces/configuration';
import { OrdersClient, OrdersType } from './clients/orders.client';
import { PublicClient, PublicType } from './clients/public.client';
import { TradeClient, TradeType } from './clients/trade.client';
import { AccountClient, AccountType } from './clients/user.client';

export class RestClient {
  private publicClient: PublicClient;
  private ordersClient: OrdersClient;
  private tradeClient: TradeClient;
  private accountClient: AccountClient;

  constructor(private sdkOptions: SDKConfigurationOptions, private apiVersion = RestApiVersion.v1) {
    const apiUrl = RestAPIUrl[sdkOptions.networkId];

    const keys = {
      orderlyKey: this.sdkOptions.publicKey,
      orderlySecret: this.sdkOptions.secretKey,
      tradingPublic: this.sdkOptions.tradingPublic,
      tradingSecret: this.sdkOptions.tradingSecret,
      orderlyKeyPrivate: this.sdkOptions.orderlyKeyPrivate,
    };

    this.publicClient = new PublicClient({ apiUrl, apiVersion: this.apiVersion }, this.sdkOptions.debug);
    this.ordersClient = new OrdersClient(
      {
        apiUrl,
        apiVersion,
        ...keys,
      },
      this.sdkOptions.accountId,
      this.sdkOptions.debug,
    );
    this.tradeClient = new TradeClient(
      {
        apiUrl,
        apiVersion,
        ...keys,
      },
      this.sdkOptions.accountId,
      this.sdkOptions.debug,
    );
    this.accountClient = new AccountClient(
      {
        apiUrl,
        apiVersion,
        ...keys,
      },
      this.sdkOptions.accountId,
      this.sdkOptions.debug,
    );
  }

  get public(): PublicType {
    return this.publicClient.public;
  }

  get orders(): OrdersType {
    return this.ordersClient.orders;
  }

  get trade(): TradeType {
    return this.tradeClient.trade;
  }

  get account(): AccountType {
    return this.accountClient.account;
  }
}
