import { HoldingInformation } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetCurrentHoldingResponse = SuccessfullApiResponse<{ holding: HoldingInformation[] }>;
