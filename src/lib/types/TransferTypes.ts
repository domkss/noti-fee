export interface CurrencyDetail {
  symbol: string;
  name: string;
  networkFees: { networkName: string; value: number }[];
}

export interface ResponseCurrentFees {
  currentFees: CurrencyDetail[];
}
