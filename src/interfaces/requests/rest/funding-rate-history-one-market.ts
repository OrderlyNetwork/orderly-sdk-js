export interface FundingRateHistoryOneMarketRequest {
    symbol: string;

    start_t?: number;
    end_t?:number;
    page?: number;
    size?: number;
}
