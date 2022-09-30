import { SucceSuccessfullApiResponse } from '../utils/api-response';
import { CreateOrderData } from './create-order.response';

export type CreateBatchOrderResponse = SucceSuccessfullApiResponse<{ rows: CreateOrderData[] }>;
