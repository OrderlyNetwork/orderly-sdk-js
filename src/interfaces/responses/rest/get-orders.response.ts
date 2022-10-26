import { Order } from '../../../entities';
import { PaginationMeta, SuccessfullApiResponse } from '../../utils';

export type GetOrdersResponse = SuccessfullApiResponse<{ meta: PaginationMeta; rows: Order[] }>;
