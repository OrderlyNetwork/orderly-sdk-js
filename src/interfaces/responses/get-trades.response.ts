import { OrderTrade } from '../../entities';
import { PaginationMeta } from '../utils';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetTradesResponse = SucceSuccessfullApiResponse<{ meta: PaginationMeta; rows: OrderTrade[] }>;
