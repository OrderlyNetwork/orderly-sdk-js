import { keyStores } from 'near-api-js';
import { NearNetworkId } from '../enums';

export const environment = (networkId: keyof typeof NearNetworkId) => {
  if (networkId === 'testnet') {
    return {
      nearWalletConfig: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        contractName: 'asset-manager.orderly.testnet',
        methodNames: ['user_announce_key', 'user_request_set_trading_key', 'create_user_account'],
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://testnet.mynearwallet.com',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        appWallet: ['sender', 'coin98-wallet', 'nightly', 'wallet-connect', 'here-wallet'],
        headers: {},
        connectCallback: {
          success: '',
          failure: '',
        },
      },
      config: {
        apiUrl: 'https://testnet-api.orderly.org',
        privateWsUrl: 'wss://testnet-ws-private.orderly.org',
        publicWsUrl: 'wss://testnet-ws.orderly.org',
        publicWebsocketKey: 'OqdphuyCtYWxwzhxyLLjOWNdFP7sQt8RPWzmb5xY',
      },
    }
  } else {
    return {
      nearWalletConfig: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        contractName: 'asset-manager.orderly-network.near',
        methodNames: ['user_announce_key', 'user_request_set_trading_key', 'create_user_account'],
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.near.org',
        walletUrl: 'https://mynearwallet.com',
        helperUrl: 'https://helper.near.org',
        explorerUrl: 'https://explorer.near.org',
        appWallet: ['sender', 'coin98-wallet', 'nightly', 'wallet-connect', 'here-wallet'],
        headers: {},
        connectCallback: {
          success: '',
          failure: '',
        },
      },
      config: {
        apiUrl: 'https://api.orderly.org',
        privateWsUrl: 'wss://ws-private.orderly.org',
        publicWsUrl: 'wss://ws.orderly.org',
        publicWebsocketKey: 'OqdphuyCtYWxwzhxyLLjOWNdFP7sQt8RPWzmb5xY',
      },
    }
  }
  
};
