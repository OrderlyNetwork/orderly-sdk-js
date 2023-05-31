export interface CallMethodSignature<T> {
  /**
   * Call method arguments
   */
  args: T;

  /**
   * Attached gas
   */
  gas?: string;

  /**
   * Attached deposit in yoctoNEAR
   */
  amount?: string;

  /**
   * Attached deposit in yoctoNEAR
   */
  deposit?: string;

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
