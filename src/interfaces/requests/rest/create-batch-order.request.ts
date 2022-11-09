import { CreateOrderRequest } from './create-order.request';

export interface CreateBatchOrderRequest {
  orders: CreateOrderRequest[];
}
