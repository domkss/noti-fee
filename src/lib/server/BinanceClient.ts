import "server-only";
import { BINANCE_DUMMY_COIN_DATA } from "./_developer_data";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
import { tokens as token_icons } from "@token-icons/core/metadata";
import CoinCapClient from "./CoinCapClient";

class BinanceClient {
  private static instance: BinanceClient;

  private rawCurrencyDataFromBinance: { [key: string]: any }[] = [];

  private calculatedWithdrawalFees: CurrencyDetail[] = [];

  public static getInstance(): BinanceClient | null {
    if (!this.instance) {
      let instance = new BinanceClient();

      let requestSuccessful = instance.getCurrencyDataFromBinance();
      if (!requestSuccessful) {
        return null;
      }
      instance.calculateWithdrawalFees();
      this.instance = instance;
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
      let networkFeeArray: { name: string; symbol: string; value: number; valueInUSD: number | null }[] = [];

      networks.map((network: { name: string; symbol: string }) => {
        let fee = this.getNetworkFeeForCurrency(currency.symbol, network.symbol);
        if (fee === null) return;
        networkFeeArray.push({
          name: network.name,
          symbol: network.symbol,
          value: fee,
          valueInUSD: CoinCapClient.getInstance()?.getUsdPriceBySymbol(currency.symbol) || null,
        });
      });

      //Token icons exists for the currency
      let token = token_icons.find((token) => token.symbol.toLowerCase() === currency.symbol.toLowerCase());
      if (token && networkFeeArray.length > 0)
        this.calculatedWithdrawalFees.push({
          symbol: currency.symbol,
          name: currency.name,
          networkFees: networkFeeArray,
        });
    });

    //Sort by market cap
    this.calculatedWithdrawalFees.sort((a, b) => {
      const rankA = CoinCapClient.getInstance()?.getRankBySymbol(a.symbol) || Infinity;
      const rankB = CoinCapClient.getInstance()?.getRankBySymbol(b.symbol) || Infinity;

      return rankA - rankB;
    });

    //Keep only the top 75 currency
    this.calculatedWithdrawalFees = this.calculatedWithdrawalFees.slice(0, 75);
  }

  private getSupportedCurrencies(): { name: string; symbol: string }[] {
    return this.rawCurrencyDataFromBinance
      .filter((currency) => currency["withdrawAllEnable"] === true)
      .map((currency) => ({
        name: currency["name"],
        symbol: currency["coin"],
      }));
  }

  private getSupportedNetworksOfCurrency(currency_symbol: string): { name: string; symbol: string }[] {
    const coin_data = this.rawCurrencyDataFromBinance;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        return coin["networkList"]
          .filter((network: { [key: string]: any }) => network["withdrawEnable"] === true)
          .map((network: { [key: string]: any }) => ({
            symbol: network["network"] as string,
            name: network["name"] as string,
          }));
      }
    }
    return [];
  }

  private getNetworkFeeForCurrency(currency_symbol: string, network_name: string): number | null {
    const coin_data = this.rawCurrencyDataFromBinance;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        for (const network of coin["networkList"]) {
          if (network["network"] === network_name) {
            return network["withdrawFee"] as number;
          }
        }
      }
    }
    return null;
  }

  private getCurrencyDataFromBinance(): boolean {
    this.rawCurrencyDataFromBinance = BINANCE_DUMMY_COIN_DATA;

    return true;
  }
}

export default BinanceClient;
