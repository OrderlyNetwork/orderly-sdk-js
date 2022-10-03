import { Order } from '../../entities';
import { PaginationMeta } from '../utils';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetOrdersResponse = SucceSuccessfullApiResponse<{ meta: PaginationMeta; rows: Order[] }>;
