import { Kline } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetKlineResponse = SucceSuccessfullApiResponse<{ rows: Kline[] }>;
