import { ec as EC } from 'elliptic';
import keccak256 from 'keccak256';
import { KeyPair } from 'near-api-js';

export type OrderlySignatureGenerator = {
  /**
   * Place order maker/taker, the order executed information will be update from websocket stream.
   * Will response immediately with an order created message.
   *
   * @link https://docs-api.orderly.network/#create-order
   */
  signMessageByTradingKey: (keyPair: KeyPair, params: string) => string;
  signPostRequestByOrderlyKey: (keyPair: KeyPair, params: string) => string;
};

export const getTradingKeyPair = tradingKeyPrivateKey => {
  const ec = new EC('secp256k1');
  const keyPair = ec.keyFromPrivate(tradingKeyPrivateKey);
  return {
    privateKey: keyPair.getPrivate().toString('hex'),
    publicKey: keyPair.getPublic().encode('hex'),
    keyPair,
  };
};

export const getOrderlyKeyPair = async orderlyKeyPrivateKey => {
  console.log('private key', orderlyKeyPrivateKey);
  return KeyPair.fromString(orderlyKeyPrivateKey);
};

function handleZero(str: string) {
  if (str.length < 64) {
    const zeroArr = new Array(64 - str.length).fill(0);
    return zeroArr.join('') + str;
  }
  return str;
}

export const signMessageByTradingKey = (keyPair, params) => {
  const ec = new EC('secp256k1');
  const msgHash = keccak256(params);
  const privateKey = keyPair.getPrivate('hex');
  const signature = ec.sign(msgHash, privateKey, 'hex', { canonical: true });
  const r = signature.r.toJSON();
  const s = signature.s.toJSON();
  const hexSignature = `${handleZero(r)}${handleZero(s)}0${signature.recoveryParam}`;

  return hexSignature;
};

export const signPostRequestByOrderlyKey = (keyPair, messageString: Uint8Array) => {
  const u8 = Buffer.from(messageString);
  const signStr = keyPair.sign(u8);
  return Buffer.from(signStr.signature).toString('base64');
};
