import { OrderTrade } from '../../../entities';
import { PaginationMeta, SuccessfullApiResponse } from '../../utils';

export type GetTradesResponse = SuccessfullApiResponse<{ meta: PaginationMeta; rows: OrderTrade[] }>;
