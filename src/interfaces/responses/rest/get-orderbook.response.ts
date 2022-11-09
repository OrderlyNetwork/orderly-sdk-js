import { Quote } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export interface OrderbookData {
  asks: Quote[];
  bids: Quote[];
}

export type GetOrderbookResponse = SuccessfullApiResponse<OrderbookData>;
