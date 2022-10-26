import { RestApiErrorCode } from '../../enums';

export type ApiResponse<T> = SuccessfullApiResponse<T> | FailedApiResponse;

export interface SuccessfullApiResponse<T> {
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
