import "server-only";
import { BINANCE_DUMMY_COIN_DATA } from "./_developer_data";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
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
      let networkFeeArray: { name: string; network: string; fee: number; feeInUSD: number; coin: string }[] = [];

      networks.map((item: { name: string; network: string; coin: string }) => {
        let fee = this.getNetworkFeeForCurrency(currency.symbol, item.network);

        let feeInUSD = CoinCapClient.getInstance()?.getUsdPriceBySymbol(currency.symbol) ?? 0;

        if (feeInUSD && fee) {
          feeInUSD = feeInUSD * fee;
        }

        if (fee === null) return;
        networkFeeArray.push({
          name: item.name,
          network: item.network,
          coin: item.coin,
          fee: fee,
          feeInUSD: feeInUSD,
        });
      });

      if (networkFeeArray.length > 0)
        this.calculatedWithdrawalFees.push({
          symbol: currency.symbol,
          name: currency.name,
          networkFees: networkFeeArray,
        });
    });

    //Sort by market cap
    this.calculatedWithdrawalFees.sort((a, b) => {
      const rankA = CoinCapClient.getInstance()?.getRankBySymbol(a.symbol) ?? Infinity;
      const rankB = CoinCapClient.getInstance()?.getRankBySymbol(b.symbol) ?? Infinity;

      return rankA - rankB;
    });

    //Keep only the top 75 currency
    this.calculatedWithdrawalFees = this.calculatedWithdrawalFees.slice(0, 100);
  }

  private getSupportedCurrencies(): { name: string; symbol: string }[] {
    return this.rawCurrencyDataFromBinance
      .filter((currency) => currency["withdrawAllEnable"] === true)
      .map((currency) => ({
        name: currency["name"],
        symbol: currency["coin"],
      }));
  }

  private getSupportedNetworksOfCurrency(currency_symbol: string): { name: string; network: string; coin: string }[] {
    const coin_data = this.rawCurrencyDataFromBinance;
    for (const coin of coin_data) {
      if (coin["coin"] === currency_symbol) {
        return coin["networkList"]
          .filter((item: { [key: string]: any }) => item["withdrawEnable"] === true)
          .map((item: { [key: string]: any }) => ({
            network: item["network"] as string,
            name: item["name"] as string,
            coin: item["coin"] as string,
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
