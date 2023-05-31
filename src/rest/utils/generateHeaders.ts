import {
  getOrderlyKeyPair,
  getTradingKeyPair,
  signMessageByTradingKey,
  signPostRequestByOrderlyKey,
} from './order.signature.secp256k1';

export const generateGetHeaders = async (
  method,
  urlParam,
  params,
  orderlyKeyPrivate,
  accountId,
  orderlyKey,
  includeQuery = false,
) => {
  const timestamp = new Date().getTime().toString();

  const messageStr = [
    timestamp,
    method.toUpperCase(),
    includeQuery ? urlParam + '?' + new URLSearchParams(params).toString() : urlParam,
    includeQuery ? '' : params && Object.keys(params).length ? JSON.stringify(params) : '',
  ].join('');

  console.log(messageStr);

  const messageBytes = new TextEncoder().encode(messageStr);
  const keyPair = await getOrderlyKeyPair(orderlyKeyPrivate);
  const orderlySign = signPostRequestByOrderlyKey(keyPair, messageBytes);

  return {
    'Content-Type': ' application/x-www-form-urlencoded',
    'orderly-account-id': accountId,
    'orderly-key': orderlyKey,
    'orderly-signature': orderlySign,
    'orderly-timestamp': timestamp,
  };
};

export const generatePostHeadersAndRequestData = async (
  method,
  urlParam,
  params,
  orderlyKeyPrivate,
  accountId,
  orderlyKey,
  tradingSecret,
  tradingPublic,
  includeQuery = false,
) => {
  const objectKeys = Object.keys(params);
  if (objectKeys.length == 1 && Array.isArray(params[objectKeys[0]])) {
    const requestDataArray = [];
    for (let i = 0; i < params[objectKeys[0]].length; i++) {
      const dataArray = params[objectKeys[0]];

      const orderMessage = Object.keys(dataArray[i])
        .sort()
        .map(key => `${key}=${dataArray[i][key]}`)
        .join('&');

      const tradingKey = getTradingKeyPair(tradingSecret);

      const sign = signMessageByTradingKey(tradingKey.keyPair, orderMessage);

      const requestData = {
        ...dataArray[i],
        signature: sign,
      };

      requestDataArray.push(requestData);
    }

    const timestamp = new Date().getTime().toString();

    const messageStr = [
      timestamp,
      method.toUpperCase(),
      urlParam,
      JSON.stringify({ [objectKeys[0]]: requestDataArray }),
    ].join('');

    console.log(messageStr);

    const messageBytes = new TextEncoder().encode(messageStr);
    const keyPairSign = await getOrderlyKeyPair(orderlyKeyPrivate);
    const orderlySign = signPostRequestByOrderlyKey(keyPairSign, messageBytes);

    const headers = {
      'content-type':
        method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT'
          ? 'application/json'
          : 'application/x-www-form-urlencoded',
      'orderly-timestamp': timestamp,
      'orderly-account-id': accountId,
      'orderly-key': orderlyKey,
      'orderly-trading-key': tradingPublic,
      'orderly-signature': orderlySign,
    };

    return { headers, requestData: requestDataArray };
  } else {
    const orderMessage = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    console.log(orderMessage)

    const tradingKey = getTradingKeyPair(tradingSecret);

    const sign = signMessageByTradingKey(tradingKey.keyPair, orderMessage);

    const requestData = {
      ...params,
      signature: sign,
    };

    const timestamp = new Date().getTime().toString();

    const messageStr = [
      timestamp,
      method.toUpperCase(),
      includeQuery ? urlParam + '?' + new URLSearchParams(requestData).toString() : urlParam,
      includeQuery ? '' : requestData && Object.keys(requestData).length ? JSON.stringify(requestData) : '',
    ].join('');

    console.log(messageStr);

    const messageBytes = new TextEncoder().encode(messageStr);
    const keyPairSign = await getOrderlyKeyPair(orderlyKeyPrivate);
    const orderlySign = signPostRequestByOrderlyKey(keyPairSign, messageBytes);

    let contentType;

    switch (method.toUpperCase()) {
      case 'POST':
        contentType = 'application/json';
        break;
      case 'PUT':
        contentType = 'application/json';
        break;
      case 'DELETE':
        contentType = 'application/x-www-form-urlencoded';
        break;
      default:
        contentType = 'application/x-www-form-urlencoded';
        break;
    }

    const headers = {
      'accept': 'application/json',
      'just-check': 'ok',
      'access-control-allow-origin': '*',
      'Content-Type': contentType,
      'orderly-timestamp': timestamp,
      'orderly-account-id': accountId,
      'orderly-key': orderlyKey,
      'orderly-trading-key': tradingPublic,
      'orderly-signature': orderlySign,
    };

    return { headers, requestData };
  }
};
