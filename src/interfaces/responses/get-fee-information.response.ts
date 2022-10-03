import { FeeInformation } from '../../entities';
import { SucceSuccessfullApiResponse } from '../utils/api-response';

export type GetFeeInformationResponse = SucceSuccessfullApiResponse<{ rows: FeeInformation[] }>;
