# Orderly SDK
Orderly SDK is a complete library to interact with Orderly contracts. You can use it in the browser, or in Node.js runtime. Orderly contracts are built on NEAR network.

## Typescript
Library is written fully in Typescript, so no additional types installation is needed.

## Environment setup
In order to use the library your env file should include the next variables:
  * `NETWORK_ID` - NEAR network identificator. Possible values can be the next:
    * `testnet`
    * `mainnet`
    * `betanet`
    * `localnet`
  * `ORDERLY_ACCOUNT_ID` - account id, on behalf of which the calls will be issued to contract
  * `ORDERLY_KEY` - public key for the network
  * `ORDERLY_SECRET` - secret key for the network
`ORDERLY_KEY` and `ORDERLY_SECRET` can be obtained, using `near login` command of [NEAR CLI](https://docs.near.org/tools/near-cli).

## Usage

### First steps
Orderly SDK exports 3 clients - `assetManager`, `faucet` and `rest`. The first two are Smart Contracts clients. In order to use them, you need to firstly call `connect` method.

### Authentication
Authentication is three-step process:
1. Call `createUserAccount` function of selected Smart Contract client
2. Call `announceKey` function
3. Call `setTradingKey` function
After that, you will be able to interact with Smart Contracts and REST API.
