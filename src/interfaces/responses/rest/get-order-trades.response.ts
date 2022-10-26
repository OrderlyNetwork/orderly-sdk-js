import { OrderTrade } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetOrderTradesResponse = SuccessfullApiResponse<{ rows: OrderTrade[] }>;
