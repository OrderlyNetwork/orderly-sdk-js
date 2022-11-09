import { OrderSide, OrderStatus, OrderType } from '../enums';

export interface Order {
  order_id: number;
  user_id: number;
  price: number;
  type: OrderType;
  quantity: 20;
  amount: null;
  executed: 20;
  visible: 1;
  symbol: string;
  side: OrderSide;
  status: OrderStatus;
  total_fee: number;
  fee_asset: string;
  client_order_id?: number;
  average_executed_price: number;
  created_time: number;
  updated_time: number;
}
