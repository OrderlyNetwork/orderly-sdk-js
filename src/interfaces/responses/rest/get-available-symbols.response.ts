import { SymbolOrderRules } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetAvailableSymbolsResponse = SuccessfullApiResponse<{ rows: SymbolOrderRules[] }>;
