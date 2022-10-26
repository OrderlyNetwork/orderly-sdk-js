export interface StorageContractResponse {
  total: string;
  available: string;
}

export interface StorageResponse {
  /**
   * Total storage deposit in NEAR
   */
  total: number;

  /**
   * Available storage deposit in NEAR
   */
  available: number;
}
