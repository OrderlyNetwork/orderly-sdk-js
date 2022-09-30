import { OrderTrade } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetOrderTradesResponse = SucceSuccessfullApiResponse<{ rows: OrderTrade[] }>;
