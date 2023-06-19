import { WsPublicUrl } from '../enums';
import { SDKConfigurationOptions } from '../interfaces/configuration';

export class WebSocketManager {
    public url: string;
    public websocket: any;
    public subscriptions: any;
    public messageCallback: any;
    public pingTimer: any;
    public pingInterval: number;

    constructor(private networkId, private accountId) {
      this.url = `${WsPublicUrl[this.networkId]}${this.accountId}`;
      this.websocket = null;
      this.subscriptions = new Set();
      this.pingInterval = 10000; // Ping interval in milliseconds (30 seconds)
      this.pingTimer = null;
    }

    connect() {
      this.websocket = new WebSocket(this.url);
  
      this.websocket.onopen = () => {
        console.log('WebSocket connection established.');
        // Subscribe to existing subscriptions
        this.subscriptions.forEach((subscription) => {
          this.sendSubscription(subscription);
        });
        this.startPing();
      };
  
      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (this.messageCallback) {
          this.messageCallback(message);
        }
      };
  
      this.websocket.onclose = () => {
        console.log('WebSocket connection closed.');
        this.stopPing();
      };
  
      this.websocket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
      };
    }
  
    disconnect() {
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
        console.log('WebSocket connection disconnected.');
        this.stopPing();
      }
    }
  
    sendSubscription(subscription) {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(subscription));
        console.log('Sent subscription:', subscription);
        this.subscriptions.add(subscription);
      } else {
        console.warn('WebSocket connection not open. Subscription not sent.');
      }
    }
  
    unsubscribe(subscription) {
      this.subscriptions.delete(subscription);
      // Unsubscribe from the server if needed
    }
  
    setMessageCallback(callback) {
      this.messageCallback = callback;
    }

    startPing() {
        this.pingTimer = setInterval(() => {
          if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({event: 'pong'}));
            console.log('Sent ping request.');
          } else {
            console.warn('WebSocket connection not open. Ping request not sent.');
          }
        }, this.pingInterval);
    }
    
    stopPing() {
    if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
        console.log('Stopped ping requests.');
    }
    }
  }
  
  