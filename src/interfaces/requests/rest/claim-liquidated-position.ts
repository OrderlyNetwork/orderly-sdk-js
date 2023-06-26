export interface ClaimLiquidatedPositionRequest {
    liquidation_id: number;
    ratio_qty_request: number;
    extra_liquidation_ratio?: number;
}