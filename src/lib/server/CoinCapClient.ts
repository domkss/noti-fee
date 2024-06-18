import { COINCAP_DUMMY_DATA } from "./_developer_data";
import logger from "../utility/logger";

class CoinCapClient {
  private static instance: CoinCapClient;
  private rawCurrencyDataFromCoinCap: { [key: string]: any }[] = [];
  private rankBySymbol: Map<string, number> = new Map<string, number>();
  private usdPriceBySymbol: Map<string, number> = new Map<string, number>();

  private constructor() {}

  public static async getInstance(): Promise<CoinCapClient | null> {
    if (!this.instance) {
      let instance = new CoinCapClient();
      let requestSuccessful = await instance.getDataFromCoinCap();

      if (!requestSuccessful) {
        return null;
      }
      instance.processRawData();

      this.instance = instance;
    }

    return CoinCapClient.instance;
  }

  private async getDataFromCoinCap(): Promise<boolean> {
    if (process.env.NODE_ENV === "development") {
      this.rawCurrencyDataFromCoinCap = COINCAP_DUMMY_DATA.data;
      return true;
    }

    //Get Data from CoinCap API
    logger.info("CoinCap Client: Fetching currency metadata from CoinCap API.");

    const REQUEST_URL = "https://api.coincap.io/v2/assets?limit=200";
    let response = await fetch(REQUEST_URL);
    if (response.ok) {
      let jsonBody = await response.json();
      this.rawCurrencyDataFromCoinCap = jsonBody.data;
      return true;
    }
    return false;
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
