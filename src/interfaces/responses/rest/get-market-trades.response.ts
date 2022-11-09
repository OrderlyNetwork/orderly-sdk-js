import { TradeInformation } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetMarketTradesResponse = SuccessfullApiResponse<{ rows: TradeInformation[] }>;
