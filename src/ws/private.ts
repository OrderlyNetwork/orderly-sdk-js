import { WsPublicUrl, WsPrivateUrl } from '../enums';
import { SDKConfigurationOptions } from '../interfaces/configuration';
import {
  getOrderlyKeyPair,
  signPostRequestByOrderlyKey,
} from '../rest/utils/order.signature.secp256k1';

export class WebSocketManager {
    public privateUrl: string;
    public privateWebsocket: any;
    public privateSubscriptions: any;
    public messageCallbackPrivate: any;
    public pingInterval: number;
    public pingTimerPrivate: any;

    constructor(private sdkOptions: SDKConfigurationOptions) {
      this.privateUrl = `${WsPrivateUrl[this.sdkOptions.networkId]}${this.sdkOptions.accountId}`;
      this.privateWebsocket = null;
      this.privateSubscriptions = new Set();
      this.pingInterval = 10000; // Ping interval in milliseconds (30 seconds)
      this.pingTimerPrivate = null;
    }

    connectPrivate() {
      this.privateWebsocket = new WebSocket(this.privateUrl);

      this.privateWebsocket.onopen = async () => {
        console.log('WebSocket connection established.');
        // Subscribe to existing subscriptions
        this.privateSubscriptions.forEach((subscription) => {
          this.sendPrivateSubscription(subscription);
        });

        console.log('start to generate ws key');

        const timestamp = new Date().getTime().toString();

        const messageStr = [
          timestamp,
        ].join('');

        const messageBytes = new TextEncoder().encode(messageStr);
        const keyPair = await getOrderlyKeyPair(this.sdkOptions.orderlyKeyPrivate);
        const orderlySign = signPostRequestByOrderlyKey(keyPair, messageBytes);

        const payload = {
          "id":"123r",
          "event":"auth",
          "params":{
              "orderly_key": this.sdkOptions.publicKey,
              "sign": orderlySign,
              "timestamp": timestamp
          }
        }

        this.privateWebsocket.send(JSON.stringify(payload))

        this.startPingPrivate()

        this.privateWebsocket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          if (this.messageCallbackPrivate) {
            this.messageCallbackPrivate(message);
          }
        };
    
        this.privateWebsocket.onclose = () => {
          console.log('WebSocket private connection closed.');
          this.stopPingPrivate();
        };
    
        this.privateWebsocket.onerror = (error) => {
          console.error('WebSocket private connection error:', error);
        };
      };
    }

    disconnectPrivate() {
      if (this.privateWebsocket) {
        this.privateWebsocket.close();
        this.privateWebsocket = null;
        console.log('WebSocket private connection disconnected.');
        this.stopPingPrivate();
      }
    }

    sendPrivateSubscription(subscription) {
      if (this.privateWebsocket && this.privateWebsocket.readyState === WebSocket.OPEN) {
        this.privateWebsocket.send(JSON.stringify(subscription));
        console.log('Sent subscription private:', subscription);
        this.privateSubscriptions.add(subscription);
      } else {
        console.warn('Private WebSocket connection not open. Subscription not sent.');
      }
    }

    unsubscribePrivate(subscription) {
      this.privateSubscriptions.delete(subscription);
      // Unsubscribe from the server if needed
    }
  
    setPrivateMessageCallback(callback) {
      this.messageCallbackPrivate = callback;
    }

    startPingPrivate() {
      this.pingTimerPrivate = setInterval(() => {
        if (this.privateWebsocket.readyState === WebSocket.OPEN) {
          this.privateWebsocket.send(JSON.stringify({event: 'pong'}));
          console.log('Sent private ping request.');
        } else {
          console.warn('Private WebSocket connection not open. Ping request not sent.');
        }
      }, this.pingInterval);
    }
    
    stopPingPrivate() {
    if (this.pingTimerPrivate) {
        clearInterval(this.pingTimerPrivate);
        this.pingTimerPrivate = null;
        console.log('Stopped private ping requests.');
    }
    }
  }
  
  