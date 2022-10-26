import { FeeInformation } from '../../../entities';
import { SuccessfullApiResponse } from '../../utils';

export type GetFeeInformationResponse = SuccessfullApiResponse<{ rows: FeeInformation[] }>;
