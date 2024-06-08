import "server-only";
import { DUMMY_ALL_COIN_DATA } from "./_developer_data";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
import { tokens as token_icons } from "@token-icons/core/metadata";

class BinanceClient {
  private static instance: BinanceClient;

  private rawCurrencyDataFromBinance: { [key: string]: any }[] = [];

  private calculatedWithdrawalFees: CurrencyDetail[] = [];

  public static getInstance(): BinanceClient {
    if (!this.instance) {
      this.instance = new BinanceClient();
      this.instance.rawCurrencyDataFromBinance = DUMMY_ALL_COIN_DATA;
      this.instance.calculateWithdrawalFees();
    }

    return this.instance;
  }

  public getCachedWithdrawalFees(): CurrencyDetail[] {
    return this.calculatedWithdrawalFees;
  }

  private calculateWithdrawalFees(): void {
    this.calculatedWithdrawalFees = [];

    this.getSupportedCurrencies().map((currency) => {
      let networks = this.getSupportedNetworksOfCurrency(currency.symbol);
      let networkFeeArray: { networkName: string; value: number }[] = [];

      networks.map((network: string) => {
        let fee = this.getNetworkFeeForCurrency(currency.symbol, network);
        networkFeeArray.push({ networkName: network, value: fee });
      });

      //Token icons exists for the currency
      let token = token_icons.find((token) => token.symbol.toLowerCase() === currency.symbol.toLowerCase());
      if (token)
        this.calculatedWithdrawalFees.push({
          symbol: currency.symbol,
          name: currency.name,
          networkFees: networkFeeArray,
        });
    });
  }

  private getSupportedCurrencies(): { name: string; symbol: string }[] {
    return this.rawCurrencyDataFromBinance.map((currency) => ({
      name: currency["name"],
      symbol: currency["coin"],
    }));
  }

  private getSupportedNetworksOfCurrency(currency_symbol: string): string[] {
    const coin_data = this.rawCurrencyDataFromBinance;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        return coin["networkList"].map((network: { [key: string]: any }) => network["network"] as string);
      }
    }
    return [];
  }

  private getNetworkFeeForCurrency(currency_symbol: string, network_name: string) {
    const coin_data = this.rawCurrencyDataFromBinance;
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
