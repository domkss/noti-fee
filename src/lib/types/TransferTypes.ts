import { z } from "zod";
import { FeeNotificationConfigSchema, CustomerBillingSchema, HistoricalFeeResponseSchema } from "./ZodSchemas";

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

export type FeeNotificationConfig = z.infer<typeof FeeNotificationConfigSchema>;

export type CustomerBillingData = z.infer<typeof CustomerBillingSchema>;

export interface FeeNotificationEmailData {
  exchange: string;
  currency: string;
  network: string;
  targetFee: string;
  currentFee: string;
  email: string;
}

export type HistoricalFeeDataResponse = z.infer<typeof HistoricalFeeResponseSchema>;
