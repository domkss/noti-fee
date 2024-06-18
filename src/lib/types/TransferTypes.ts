export interface CurrencyDetail {
  symbol: string;
  name: string;
  networkFees: NetworkFeeDetail[];
}

export interface NetworkFeeDetail {
  name: string;
  network: string;
  coin: string;
  fee: number;
  feeInUSD: number;
}

export function isCurrencyDetail(variable: any): variable is CurrencyDetail {
  return (
    (variable as CurrencyDetail).symbol !== undefined &&
    (variable as CurrencyDetail).name !== undefined &&
    Array.isArray((variable as CurrencyDetail).networkFees)
  );
}

export interface ResponseCurrentFees {
  currentFees: CurrencyDetail[];
}

export interface NotificationType {
  email: string;
  exchange: string;
  currency: string;
  network: string;
  targetFee: string;
}
