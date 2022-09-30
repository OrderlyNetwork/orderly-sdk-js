import { RestApiErrorCode } from '../../enums';

export type ApiResponse<T> = SucceSuccessfullApiResponse<T> | FailedApiResponse;

export interface SucceSuccessfullApiResponse<T> {
  success: true;
  data: T;
  timestamp?: number;
}

export interface FailedApiResponse {
  success: false;
  code: RestApiErrorCode;
  message: string;
  timestamp?: number;
}
