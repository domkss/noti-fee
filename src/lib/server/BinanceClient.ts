import "server-only";
import { DUMMY_ALL_COIN_DATA } from "./_developer_data";

class BinanceClient {
  private static instance: BinanceClient;

  private all_currency_raw_data: { [key: string]: any }[] = [];

  private calculated_withdrawal_fees: Map<string, Map<string, number>> = new Map();

  public static getInstance(): BinanceClient {
    if (!this.instance) {
      this.instance = new BinanceClient();
      this.instance.all_currency_raw_data = DUMMY_ALL_COIN_DATA;
      this.instance.calculateWithdrawalFees();
    }

    return this.instance;
  }

  public getCachedWithdrawalFees(): Map<string, Map<string, number>> {
    return this.calculated_withdrawal_fees;
  }

  private calculateWithdrawalFees(): void {
    this.calculated_withdrawal_fees.clear();

    this.getSupportedCurrencySymbols().map((coin) => {
      let networks = this.getSupportedNetworksOfCurrency(coin);
      let feeMap = new Map<string, number>();

      networks.map((network: string) => {
        let fee = this.getNetworkFeeForCurrency(coin, network);
        feeMap.set(network, fee);
      });
      this.calculated_withdrawal_fees.set(coin, feeMap);
    });
  }

  private getSupportedCurrencySymbols(): string[] {
    return this.all_currency_raw_data.map((coin) => coin["coin"] as string);
  }

  private getSupportedNetworksOfCurrency(currency_symbol: string): string[] {
    const coin_data = this.all_currency_raw_data;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        return coin["networkList"].map((network: { [key: string]: any }) => network["network"] as string);
      }
    }
    return [];
  }

  private getNetworkFeeForCurrency(currency_symbol: string, network_name: string) {
    const coin_data = this.all_currency_raw_data;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        for (const network of coin["networkList"]) {
          if (network["network"] === network_name) {
            return network["withdrawFee"];
          }
        }
      }
    }
    return null;
  }
}

export default BinanceClient;
