import { TransactionSide, TransactionStatus } from '../../enums';

export interface GetAssetHistoryRequest {
  /**
   * Token name you want to search
   */
  token?: string;

  side?: keyof typeof TransactionSide;

  status?: keyof typeof TransactionStatus;

  /**
   * Start time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  start_t?: number;

  /**
   * End time range that wish to query, noted the time stamp is 13-digits timestamp.
   */
  end_t?: number;

  /**
   * The page wish to query. (default: 1)
   */
  page?: number;
}
