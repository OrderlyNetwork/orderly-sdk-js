export interface CallMethodSignature<T> {
  /**
   * Call method arguments
   */
  args: T;

  /**
   * Attached gas
   */
  gas?: number;

  /**
   * Attached deposit in yoctoNEAR
   */
  amount?: number;

  /**
   * callbackUrl after the transaction approved
   */
  callbackUrl?: string;

  /**
   * meta information NEAR Wallet will send back to the application.
   * `meta` will be attached to the `callbackUrl` as a url search param
   */
  meta?: string;
}
