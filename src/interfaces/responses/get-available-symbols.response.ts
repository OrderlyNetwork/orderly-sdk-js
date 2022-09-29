import { SymbolOrderRules } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetAvailableSymbolsResponse = SucceSuccessfullApiResponse<{ rows: SymbolOrderRules[] }>;
