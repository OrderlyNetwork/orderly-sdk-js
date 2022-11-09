export interface SymbolOrderRules {
  symbol: string;
  quote_min: number;
  quote_max: number;
  quote_tick: number;
  base_min: number;
  base_max: number;
  base_tick: number;
  min_notional: number;
  price_range: number;
  created_time: number;
  updated_time: number;
}
