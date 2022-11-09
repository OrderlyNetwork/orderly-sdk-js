import { SuccessfullApiResponse } from '../../utils';
import { CreateOrderData } from './create-order.response';

export type CreateBatchOrderResponse = SuccessfullApiResponse<{ rows: CreateOrderData[] }>;
