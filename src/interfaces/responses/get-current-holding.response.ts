import { HoldingInformation } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetCurrentHoldingResponse = SucceSuccessfullApiResponse<{ holding: HoldingInformation[] }>;
