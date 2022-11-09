import { Kline } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetKlineResponse = SuccessfullApiResponse<{ rows: Kline[] }>;
