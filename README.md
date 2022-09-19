# Orderly SDK
Orderly SDK is a complete library to interact with Orderly contracts. You can use it in the browser, or in Node.js runtime. Orderly contracts are built on NEAR network.

## Typescript
Library is written fully in Typescript, so no additional types installation is needed.

## Usage

### Initialization
Orderly SDK client needs 4 variables to be initalized:
1. Network id - NEAR network id to which we want to connect when we are working with the SDK. Currently Orderly contracts are deployed to `testnet` and `mainnet`.
2. Account ID - account id, with which the SKD will be working
3. Public key - NEAR public key, retrieved via NEAR CLI `login` command
4. Secret key - NEAR private key, retrieved via NEAR CLI `login` command

> **_Note:_**
> You can read about NEAR CLI [here](https://docs.near.org/tools/near-cli)

These parameters can be passed:
1. Via constructor (_optional_)
```ts
const orderly = new Orderly({
  networkId: 'testnet' | 'mainnet',
  accountId: '<Your account id>',
  publicKey: '<Your public key>',
  secretKey: '<Your private key>',
})
```
2. Via environment variables
```env
NETWORK_ID='testnet' | 'mainnet'
ORDERLY_ACCOUNT_ID=<Your account id>
ORDERLY_KEY=<Your public key>
ORDERLY_SECRET=<Your private key>
```
Constructor parameters are optional, so you can create new instance of SDK client just like this - `new Orderly()`. In this case library will look for environment variables. If both ways are provided, the constructor parameters are preffered.
### First steps
After instantiating the client, call the `connect` function.

```ts
const orderly = new Orderly();

await orderly.connect();

// After that you will be able to work with the library
```
### Avaiable clients
Orderly SDK client incapsulates three clients:
1. Asset manager contract client - `orderly.assetManager`
2. Faucet contract client - `orderly.faucet`
3. REST client - `orderly.rest`
### Methods
#### Asset manager contract

* `assetManager.deposit({ amount: number, receiver_id?: string, msg?: string })` - use this method to deposit tokens to your account. If `receiver_id` is passed then it will deposit fugitive tokens, otherwise - native.
* `assetManager.withdraw({ token: string, amount: number})` - use this method to withdraw tokens from your account.
* `assetManager.isTokenListed(token: string)` - use this method to check if token is whitelisted for your account on the contract.
* `assetManager.isSymbolPairListed(pair: string)` - use this method to check if symbol pair is whitelisted for your account on the contract.
* `assetManager.getPossibleTokens()` - use this method to get all whitelisted tokens for your account on the contract.

#### Faucet contract
* `getTokens()`
