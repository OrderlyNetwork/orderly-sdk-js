import { OrderType } from '../../enums';
import { SucceSuccessfullApiResponse } from '../utils';

export interface CreateOrderData {
  order_id: number;
  client_order_id?: string;
  order_type: OrderType;
  order_price: number;
  order_quantity?: number;
  order_amount?: number;
}

export type CreateOrderResponse = SucceSuccessfullApiResponse<CreateOrderData>;
