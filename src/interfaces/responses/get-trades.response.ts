import { TradeInformation } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetTradesResponse = SucceSuccessfullApiResponse<{ rows: TradeInformation[] }>;
