# Orderly SDK
Orderly SDK is a complete library to interact with Orderly contracts and rest api. You can use it in the browser. Orderly contracts are built on NEAR network.

## Typescript
Library is written fully in Typescript, so no additional types installation is needed.

## Usage

### Available clients
1. `contractsApi` - asset manager smart contract client;
2. `ftClient` - fungible token smart contract client;
3. `restApi` - REST API client.
4. `wsPublic` - Publis WebSocket. Wallet connection not required.
5. `wsPrivate` - Private WebSocket. Wallet connection required.

### Initialization
To initialize these clients you will need:
1. For asset manager contract client - SDK configration options;
2. For fungible token contract client - contract URL and SDK configration options;
3. For REST client - SDK configration options;

SDK configuration options is an object with the next properties:
1. `networkId` - NEAR network id to which we want to connect when we are working with the SDK. Currently Orderly contracts are deployed to `testnet` and `mainnet` (fungible token contract is deployed only to `testnet`).

> **_Note:_**
> You can read about NEAR CLI [here](https://docs.near.org/tools/near-cli)

Also, for smart contract clients, if you want to change the NEAR configuration options, pass them as the last parameter in their constructors.


### First steps
After instantiating the smart contract client, call the `connect` function.

```js
import { AuthClient } from 'orderly-sdk';

const authClient = new AuthClient({
  networkId: 'testnet',
  contractId: 'asset-manager.orderly.testnet'
});

// you can bind that to connection button
await authClient.connect()

const api = await authClient.restApi()
const contract = await authClient.contractsApi();
const ft = await authClient.ftClient();


```

Also you can use public API as well without connection.

```js
import { AuthClient } from 'orderly-sdk';

const authClient = new AuthClient({
  networkId: 'testnet',
  contractId: 'asset-manager.orderly.testnet',
  debug: true
});

const pubClient = authClient.publicClient();
await pubClient.getAvailableSymbols()

```
To avoid version conflicts of `near-js-api` you can import it from SDK.

```js
import { AuthClient } from 'orderly-sdk';

const authClient = new AuthClient({
  networkId: 'testnet',
  contractId: 'asset-manager.orderly.testnet',
  debug: true
});

const nearApi = authClient.nearJsApi
```

### Public WebSocket
Note: When user not connected you can use public key for wsPublic 
`bf6eb263984c964a0cda3e9a35aa486268eea085d9b90fe792c8f9ad7e129a2c`

```js
    const [wsClientPublic, setWsClientPublic] = useState(null);

    const initPublicWs = () => {
      const authClient = new AuthClient({
        networkId: 'testnet',
        contractId: 'asset-manager.orderly.testnet',
        debug: true
      });

      const publicKeyOrWalletID = 'bf6eb263984c964a0cda3e9a35aa486268eea085d9b90fe792c8f9ad7e129a2c'

      const wsPublic = authClient.wsClientPublic('testnet', publicKeyOrWalletID);
      wsPublic.connect();
      setWsClientPublic(wsPublic)
    }

    const subscribe = () => {
      const subscription = { id: 'client_id1', event: 'subscribe', topic: 'SPOT_WOO_USDC@trade' };
      wsClientPublic.sendSubscription(subscription);
    }

    const setPublicWsCallback = () => {
      wsClientPublic.setMessageCallback((message) => {
        // Process the received message
        console.log('Received data:', message);
      });
    }
```

### Private WebSocket
Required wallet connection

```js
    const [wsClientPrivate, setWsClientPrivate] = useState(null);

    const initPrivateWs = async () => {
      const authClient = new AuthClient({
        networkId: 'testnet',
        contractId: 'asset-manager.orderly.testnet',
        debug: true
      });

      const wsPrivate = await authClient.wsClientPrivate();
      await wsPrivate.connectPrivate();
      setWsClientPrivate(wsPrivate);
    }

    const subscribePrivate = () => {
      const subscription = {
        "id": "123r",
        "topic": "balance",
        "event": "subscribe"
      }
      wsClientPrivate.sendPrivateSubscription(subscription);
    }

    const setPublicWsCallback = () => {
      wsClientPrivate.setPrivateMessageCallback((message) => {
        // Process the received message
        console.log('Received data:', message);
      });
    }
```


### Asset manager contract
_Documentation can be found [here](https://docs.orderly.network/build-on-orderly/host-a-gui/smart-contract-api)._
#### Storage
_Path: `<Asset Manager Contract Client Instance>.storage.<method (described above)>`_

Orderly asset manager contract implements NEP-145 protocol, so has next methods according to it:
* `deposit` - method to deposit NEAR into storage from account.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `amount` | `number` | Yes | Amount of NEAR to add to storage deposit |
  ```ts
    await contract.storage.deposit(100000)
  ```
* `withdraw` - method to withdraw NEAR from storage into account.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `amount` | `string` | No | Amount of NEAR to withdraw from storage into account; can be ommited, then whole available deposit will be returned into account |
  ```ts
    await contract.storage.withdraw('1')
  ```
* `balance` - method to get current storage balance.
  ```ts
    await contract.storage.balance()
  ```
  **Parameters:** _None_
* `unregister` - unregisters user from contract, withdraws available deposit and removes all keys. 
  ```ts
    await contract.storage.unregister()
  ```

  **Right now throws an error, because is planned for the next release**
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `force` | `boolean` | No | If `true` will ignore account balances (burn them) and close the account; if `false` (or omitted) and caller has a positive registered balance it will throw an error |
#### Other methods
_Path: `<Asset Manager Contract Client Instance>.<method (described above)>`_
* `depositNEAR` - this method is used to deposit NEAR to your account. 
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `amount` | `number` | Yes | How much NEAR to deposit |
  ```ts
    await contract.depositNEAR(amount)
  ```
* `withdraw` - this method is used to withdraw tokens from your account in contract.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `token` | `string` | Yes | Token to withdraw from account |
  | `amount` | `number` | Yes | How much tokens to withdraw |
  ```ts
    await contract.withdraw({token: 'usdc.orderly.testnet', amount: 50000000})
  ```
* `isTokenListed` - this method is used to check if token is whitelisted for your account on the contract.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `token` | `string` | Yes | Token to check |
  ```ts
    await contract.isTokenListed('usdc.orderly.testnet')
  ```
* `isSymbolPairListed` - this method is used to check if symbol pair is whitelisted for your account on the contract.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `pair` | `string` | Yes | Symbol pair to check |
  ```ts
    await contract.isSymbolPairListed('SPOT_NEAR_USDC')
  ```
* `getPossibleTokens` - this method is used to get all whitelisted tokens for your account on the contract.
  ```ts
    await contract.getPossibleTokens()
  ```
* `userRequestSettlement` - Public payable method enabling the user to request to settle the account's futures positions PnL.
  ```ts
    await contract.userRequestSettlement()
  ```
* `getUserTokenBalance` - this method is used to check account tokens balance.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `user` | `string` | No | Wallet address. If empty then will return balance of connected user |
  ```ts
    await contract.getUserTokenBalance('user.near')
  ```

* `storageBalanceOf` - this method is used to get storage balance of user. 
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `accountId` | `string` | Yes | Account id of user |
  ```ts
    await contract.storageBalanceOf(accountId)
  ```

* `storageUsageOf` - this method is used to get storage usage of user. 
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `accountId` | `string` | Yes | Account id of user |
  ```ts
    await contract.storageUsageOf(accountId)
  ```
  
  **Parameters:** _None_
### Fungible token contract

* `deposit` - this method is used to deposit fungible token to your account. 
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `amount` | `number` | Yes | How much tokens to deposit |
  | `ftTokenContract` | `string` | Yes | Token contract address, for example `usdc.orderly.testnet` |
  ```ts
    await ft.deposit(100000000, 'usdc.orderly.testnet')
  ```

### REST client
_Documentation can be found [here](https://docs-api.orderly.network/#restful-api)_

REST client consists of the next clients:
- `public` - public methods client;
- `orders` - orders methods client;
- `trade` - trade methods client;
- `user` - user methods client.

#### Public methods
- `getSymbolOrderRules` - this endpoint provides all the values for the rules that an order need to fulfil in order for it to be placed successfully.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | Symbol for which to get order rules |
  ```ts
    await api.public.getSymbolOrderRules('SPOT_NEAR_USDC')
  ```
- `getAvailableSymbols` - get available symbols that Orderly Network supports, and also send order rules for each symbol.
  ```ts
    await api.public.getAvailableSymbols()
  ```

  **Parameters:** _None_
- `getFeeInformation` - get the latest Orderly Network fee structure.
  ```ts
    await api.public.getFeeInformation()
  ```

  **Parameters:** _None_
- `getMarketTrades` - get latest market trades.
  
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get latest market trades |
  | `limit` | `number` | No | How may records to return |
  ```ts
    await api.public.getMarketTrades('SPOT_NEAR_USDC', 10)
  ```

- `getPredictedFundingRateForAll` - get predicted funding rate for all.
  
  Get the:
   - `last_funding_rate` : latest hourly funding rate for all the markets for the last funding period (dt = 60s)
   - `last_average_funding_rate` : average of all funding rates on the last hour (ex: 10am-11am)
   - `est_funding_rate` : rolling average of all funding rates over the last hour (ex: current time - 1hour : 10:15 -11:15 am)

  ```ts
    await api.public.getPredictedFundingRateForAll()
  ```

- `getPredictedFundingRateForOne` - get predicted funding rate for symbol.
  
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get funding rate |
  ```ts
    await api.public.getPredictedFundingRateForOne('PERP_BTC_USDT')
  ```

- `getFundingRateHistoryForOneMarket` - Get funding rate for one market.
  
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get funding rate |
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `end_t` | `timestamp` | No | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | Default: 60 |

  ```ts

    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }

    await api.public.getFundingRateHistoryForOneMarket(payload)
  ```

- `getFundingRateHistoryPerHourForOneMarket` - Get average funding rate per hour for one market.
  
  Put a limit to the time window : if between start_t and end_t , the number of data is larger than limit, return data from start_t to start_t +
limit.

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get funding rate |
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `end_t` | `timestamp` | No | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | Default: 60 |

  ```ts

    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }

    await api.public.getFundingRateHistoryPerHourForOneMarket(payload)
  ```

- `getFuturesInfoForAllMarkets` - Get basic futures information for all the markets.

  ```ts
    await api.public.getFuturesInfoForAllMarkets()
  ```

- `getFuturesForOneMarket` - Get basic futures information for one market.
  
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get futures information |
  ```ts
    await api.public.getFuturesForOneMarket('PERP_BTC_USDT')
  ```

- `getPositionsUnderLiquidation` - Get positions under liquidation.
  
  ```ts
    await api.public.getPositionsUnderLiquidation()
  ```

- `getPositionsUnderLiquidationPerPerpMarket` - Get positions under liquidation by symbol.
  
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get information |
  ```ts
    await api.public.getPositionsUnderLiquidationPerPerpMarket('PERP_BTC_USDT')
  ```

- `getLiquidatedPositionsInfo` - Get liquidated positions info.
  

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get info |
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `end_t` | `timestamp` | No | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | Default: 60 |

  ```ts

    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }

    await api.public.getLiquidatedPositionsInfo(payload)
  ```

- `getInsuranceFundInfo` - Get insurance fund info.
  
  ```ts
    await api.public.getInsuranceFundInfo()
  ```

- `getFuturesFeeInformation` - Get the current Orderly Network fee structure.
  
  ```ts
    await api.public.getFuturesFeeInformation()

#### Orders client
- `create` - place order.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` |	`string` |	Yes | Token symbol |	
  | `client_order_id` |	`string` | No |	Customized order_id, a unique id among open orders |
  | `order_type` | `enum` |	Yes | Order type. Possible values are: `LIMIT`/`MARKET`/`IOC`/`FOK`/`POST_ONLY`/`ASK`/`BID`. |	
  | `order_price`	| `number` | No |	If order_type is `MARKET`, then is not required, otherwise this parameter is required |
  | `order_quantity` | `number` | No | For `MARKET`/`ASK`/`BID` order, if `order_amount` is given, it is not required. |
  | `order_amount` | `number` |	No | For `MARKET`/`ASK`/`BID` order, the order size in terms of quote currency |
  | `visible_quantity` | `number` |	No | The order quantity shown on orderbook. (default: equal to `order_quantity`) |
  | `side` | `enum` |	Yes | Order side. Possible values are: `SELL`/`BUY`. |
  ```ts
    const order = {
      symbol: 'SPOT_NEAR_USDC',
      order_type: 'LIMIT',
      side: 'BUY',
      order_price: 1.11,
      order_quantity: 2.00000000
    }

    await api.orders.create(order)
  ```
- `createBatch` - places multiple orders at once.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `orders` | `array` | Yes | Array of objects used for create order request |
  ```ts
    const order1 = {
      symbol: 'SPOT_NEAR_USDC',
      order_type: 'LIMIT',
      side: 'BUY',
      order_price: 1.11,
      order_quantity: 2.00000000
    }

    const order2 = {
      symbol: 'SPOT_WOO_USDC',
      order_type: 'LIMIT',
      side: 'BUY',
      order_price: 0.12,
      order_quantity: 10.00000000
    }

    await api.orders.createBatch([order1, order2])
  ```
- `cancel` - cancels placed request.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` |	Yes | Token symbol |	
  | `order_id` | `number` | | ID of the order; **required** if `client_order_id` is not provided |
  | `client_order_id` | `number` | | `client_order_id` of the order; **required** if `order_id` is not provided |
  ```ts
    const cancleOrderRequest = {
      symbol: 'SPOT_NEAR_USDC',
      order_id: 12345
    }

    await api.orders.cancle(cancleOrderRequest)
  ```
- `cancelBatch` - cancels multiple placed orders for symbol.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` |	Yes | Token symbol |	
  ```ts
    await api.orders.cancelBatch({symbol: 'SPOT_NEAR_USDC'})
  ```
- `getOrder` - gets order by `client_order_id` or `order_id`.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `order_id` | `number` | | ID of the order; **required** if `client_order_id` is not provided |
  | `client_order_id` | `number` | | `client_order_id` of the order; **required** if `order_id` is not provided |
  ```ts
    await api.orders.getOrder({order_id: 12345})
  ```
- `getOrders` - gets multiple orders by provided params.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | No | Which token to query orders for |	
  | `side` |	`enum` | No |	Which order side orders to get. Possible values are: `BUY`/`SELL`. |
  | `order_type` | `enum` |	No | Which order type orders to get. Possible values are `LIMIT`/`MARKET` |
  | `order_tag` |	`string` | No |	An optional tag for the order. |
  | `status` | `enum` |	No | Which order status orders to get. Possible values are:	`NEW`/`CANCELLED`/`PARTIAL_FILLED`/`FILLED`/`REJECTED`/`INCOMPLETE`/`COMPLETED` |
  | `start_t`	| `number` | No |	Start time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `end_t` | `number` | No |	End time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `page` | `number` |	No | The page wish to query (default: 1). |
  | `size` | `number` | No | The page size wish to query (default: 25, max: 500) |
  ```ts
    await api.orders.getOrders({})
  ```
- `getOrderbook` - get snapshot of current orderbook.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | Token symbol for which to get the snapshot |
  | `max_level` | `number` | No | The levels wish to show on both side (default: 100). |
  ```ts
    await api.orders.getOrderbook('SPOT_NEAR_USDC', 10)
  ```
#### Trade client
- `getKline` - get the latest klines of the trading pairs.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string`	| Yes | Token symbol for which to get klines |	
  | `type` | `enum` | Yes |	Which kline type to get `1m`/`5m`/`15m`/`30m`/`1h`/`4h`/`12h`/`1d`/`1w`/`1mon`/`1y` |
  | `limit` |	`number` | No | Number of klines to get (default: 100, maximum: 1000). |
  ```ts
    const getKlineData = {
      symbol: 'SPOT_NEAR_USDC',
      type: '1h',
      limit: 100
    }

    await api.trade.getKline(getKlineData)
  ```
- `getOrderTrades` - get specific order trades by order_id.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `order_id` | `number`	| Yes | ID of the order |
  ```ts
    await api.trade.getOrderTrades(12345)
  ```
- `getTrades` - get client’s trades history in a range of time.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | No | Token symbol for which to get trades |
  | `tag` |	`string` | No |	An optional tag for the order. |
  | `start_t`	| `number` | No |	Start time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `end_t` | `number` | No |	End time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `page` | `number` |	No | The page wish to query (default: 1). |
  | `size` | `number` | No | The page size wish to query (default: 25) |
  ```ts
    await api.trade.getTrades({symbol: 'SPOT_NEAR_USDC'})
  ```
- `getTrade` - get specific transaction detail by trade id.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `tradeId` |	`number` | Yes |	ID of the trade |
  ```ts
    await api.trade.getTrade(54321)
  ```
- `getFundingFeeHistory` - Get funding fee history.
  Put a limit to the time window : if between start_t and end_t , the number of data is larger than limit, return data from start_t to start_t +
  limit.
  - Max (24h) = 8640
  - Default (3 hour of data)= 1080

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get funding rate |
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `end_t` | `timestamp` | No | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | Default: 60 |
  ```ts
    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }
    await api.trade.getFundingFeeHistory(payload)
  ```

- `getLiquidatedPositionsByLiquidator` - Get liquidated positions by Liquidator.

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | Yes | For which symbol to get |
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `end_t` | `timestamp` | No | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp. If start_t and end_t are not filled, the newest funding rate will be returned. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | Default: 60 |
  ```ts
    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }
    await api.trade.getLiquidatedPositionsByLiquidator(payload)
  ```

- `getLiquidatedPositionsOfAccount` - Get liquidated positions by Liquidator.

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` | `string` | No | For which symbol to get|
  | `start_t` | `timestamp` | No | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
  | `end_t` | `timestamp` | No | end time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `page` | `number` | No | the page you wish to query. |
  | `size` | `number` | No | the page size you wish to query. (max: 500) |
  ```ts
    const payload = {
      symbol: 'PERP_BTC_USDC',
      page: 1,
      size: 5
    }
    await api.trade.getLiquidatedPositionsOfAccount(payload)
  ```

- `claimLiquidatedPosition` - claim liquidated position.

  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `liquidation_id ` | `number` | Yes | ID |
  | `ratio_qty_request` | `number` | Yes | What ratio of the available liquidated position quantities liquidator is claiming (max 100%) |
  | `extra_liquidation_ratio` | `number` | No | Range between [0-1]. Only if ratio_qty_request is equal to 100% : this represents the extra ratio the liquidator is ready to claim in case the real position quantities to be liquidated at the real time mark price is higher than the ones posted on endpoints.|

  ```ts
    const payload = {
      liquidation_id: 123,
      ratio_qty_request: 1,
    }
    await api.trade.claimLiquidatedPosition(payload)
  ```
- `getAllPositionInfo` - get all positions info.
  ```ts
    await api.trade.getAllPositionInfo(54321)
  ```

- `getOnePositionInfo` - get position info by symbop.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `symbol` |	`string` | Yes |	For which symbol to get |
  ```ts
    await api.trade.getOnePositionInfo('PERP_BTC_USDC')
  ```
#### User client
- `getCurrentHolding` - get holding summary of the user.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `all` |	`boolean` | No |	If `true` then will return all token even if balance is empty. |
  ```ts
    await api.account.getCurrentHolding(true)
  ```
- `getInformation` - get account information.
  ```ts
    await api.account.getInformation()
  ```
  **Parameters:** _None_
- `getAssetHistory` - get asset history, includes token deposit/withdraw and collateral deposit/withdraw.
  | Parameter name | Type | Is required? | Description |
  | --- | :---: | :---: | --- |
  | `token` | `string` | No | Token name you want to search |
  | `side` | `enum` | No | Which history record type to query. Possible values are: `DEPOSIT`/`WITHDRAW` |
  | `status` | `enum` | No | Which status to search. Possible values are: `NEW`/`CONFIRM`/`PROCESSING`/`COMPLETED`/`FAILED` |
  | `start_t`	| `number` | No |	Start time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `end_t` | `number` | No |	End time range that wish to query, noted the time stamp is 13-digits timestamp. |
  | `page` | `number` |	No | The page wish to query (default: 1). |
  ```ts
    await api.account.getAssetHistory({side: 'DEPOSIT'})
  ```

