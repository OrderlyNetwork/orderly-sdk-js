import { RestApiErrorCode } from '../../enums';

export type ApiResponse<T> = SucceSuccessfullApiResponse<T> | FailedApiResponse;

export interface SucceSuccessfullApiResponse<T> {
  success: true;
  data: T;
}

export interface FailedApiResponse {
  success: false;
  code: RestApiErrorCode;
  message: string;
}
