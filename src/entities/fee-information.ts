export interface FeeInformation {
  tier: string;

  /**
   * String represantion of maker fee in percents
   */
  maker_fee: string;

  /**
   * String represantion of taker fee in percents
   */
  taker_fee: string;

  /**
   *  Minimum 30-day volume (in USDC) required for eligibility of this tier
   */
  volume_min: number;

  /**
   *  Maximum 30-day volume (in USDC) required for eligibility of this tier
   */
  volume_max: number;
}
