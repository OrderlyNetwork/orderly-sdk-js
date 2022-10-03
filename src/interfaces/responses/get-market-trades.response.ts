import { TradeInformation } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetMarketTradesResponse = SucceSuccessfullApiResponse<{ rows: TradeInformation[] }>;
