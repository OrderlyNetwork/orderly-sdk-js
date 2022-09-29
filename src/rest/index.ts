import { NearNetworkId, RestAPIUrl, RestApiVersion } from '../enums';
import { PublicClient, PublicType } from './clients/public.client';

export type RestType = {
  public: PublicType;
};

export class RestClient {
  private publicClient: PublicClient;

  constructor(networkId: keyof typeof NearNetworkId, private tradingKey: string, apiVersion = RestApiVersion.v1) {
    const apiUrl = RestAPIUrl[networkId];

    this.publicClient = new PublicClient({ apiUrl, apiVersion });
  }

  get rest(): RestType {
    return {
      public: this.publicClient.public,
    };
  }
}
