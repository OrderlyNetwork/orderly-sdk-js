import { Quote } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export interface OrderbookData {
  asks: Quote[];
  bids: Quote[];
}

export type GetOrderbookResponse = SucceSuccessfullApiResponse<OrderbookData>;
