import { Transaction } from '../../../entities';
import { PaginationMeta, SuccessfullApiResponse } from '../../utils';

export type GetAssetHistoryResponse = SuccessfullApiResponse<{ meta: PaginationMeta; rows: Transaction[] }>;
