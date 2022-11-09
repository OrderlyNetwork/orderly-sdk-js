import { OrderSide } from '../enums';

export interface OrderTrade {
  id: number;
  symbol: string;
  fee: number;
  fee_asset: string;
  side: OrderSide;
  order_id: number;
  executed_price: number;
  executed_quantity: number;
  executed_timestamp: number;
  is_maker: number;
}
