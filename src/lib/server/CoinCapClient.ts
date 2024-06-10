import { COINCAP_DUMMY_DATA } from "./_developer_data";

class CoinCapClient {
  private static instance: CoinCapClient;
  private rawCurrencyDataFromCoinCap: { [key: string]: any }[] = [];
  private rankBySymbol: Map<string, number> = new Map<string, number>();
  private usdPriceBySymbol: Map<string, number> = new Map<string, number>();

  public static getInstance(): CoinCapClient | null {
    if (!this.instance) {
      let instance = new CoinCapClient();
      let requestSuccessful = instance.getDataFromCoinCap();

      if (!requestSuccessful) {
        return null;
      }
      instance.processRawData();

      this.instance = instance;
    }

    return CoinCapClient.instance;
  }

  private getDataFromCoinCap(): boolean {
    this.rawCurrencyDataFromCoinCap = COINCAP_DUMMY_DATA.data;
    return true;
  }

  private processRawData(): void {
    this.rawCurrencyDataFromCoinCap.map((currency) => {
      this.rankBySymbol.set(currency.symbol, currency.rank);
      this.usdPriceBySymbol.set(currency.symbol, currency.priceUsd);
    });
  }

  public getRankBySymbol(symbol: string): number {
    if (this.rankBySymbol.size < 100) return -1;
    if (this.rankBySymbol.has(symbol)) {
      return this.rankBySymbol.get(symbol) ?? Infinity;
    }
    return Infinity;
  }

  public getUsdPriceBySymbol(symbol: string): number | null {
    if (this.usdPriceBySymbol.size < 100) return null;
    if (this.usdPriceBySymbol.has(symbol)) {
      return this.usdPriceBySymbol.get(symbol) ?? null;
    }
    return null;
  }
}

export default CoinCapClient;
