export interface CurrencyDetail {
  symbol: string;
  name: string;
  networkFees: NetworkFeeDetail[];
}

export interface NetworkFeeDetail {
  name: string;
  symbol: string;
  value: number;
  valueInUSD: number | null;
}

export interface ResponseCurrentFees {
  currentFees: CurrencyDetail[];
}
