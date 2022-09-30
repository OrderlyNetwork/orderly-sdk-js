import { Transaction } from '../../entities';
import { PaginationMeta } from '../utils';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetAssetHistoryResponse = SucceSuccessfullApiResponse<{ meta: PaginationMeta; rows: Transaction[] }>;
