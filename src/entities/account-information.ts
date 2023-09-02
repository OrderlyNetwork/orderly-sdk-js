import { LeverageType } from "../enums/leverage.enum";

/**
 * Get basic account information including current user fee rates.
 * 
 * @link https://docs-api.orderly.network/#restful-api-private-get-account-information
 */
export interface AccountInformation {
  account_id: string;
  email: string;
  account_mode: string;
  tier: string;
  taker_fee_rate: number;
  maker_fee_rate: number;
  max_leverage: LeverageType;
}
