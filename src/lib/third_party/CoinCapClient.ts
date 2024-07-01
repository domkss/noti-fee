import { COINCAP_DUMMY_DATA } from "./_developer_data";
import Logger from "../utility/Logger";
import { getErrorMessage } from "../utility/UtilityFunctions";

class CoinCapClient {
  private static instance: CoinCapClient;
  private rawCurrencyDataFromCoinCap: { [key: string]: any }[] = [];
  private rankBySymbol: Map<string, number> = new Map<string, number>();
  private usdPriceBySymbol: Map<string, number> = new Map<string, number>();
  private lastDataUpdateTimeStamp: number = 0;
  private readonly UPDATE_INTERVAL_MS = 300000;

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

  public async refreshData(): Promise<void> {
    let currentTime = Date.now();
    if (currentTime - this.lastDataUpdateTimeStamp < this.UPDATE_INTERVAL_MS) {
      Logger.info({ message: "CoinCap Client: Data is up to date." });
      return;
    }

    let requestSuccessful = await this.getDataFromCoinCap();
    if (!requestSuccessful) {
      return;
    }
    this.processRawData();
  }

  private async getDataFromCoinCap(): Promise<boolean> {
    //Update Last Data Update Timestamp
    this.lastDataUpdateTimeStamp = Date.now();

    if (process.env.NODE_ENV === "development") {
      this.rawCurrencyDataFromCoinCap = COINCAP_DUMMY_DATA.data;
      return true;
    }

    //Get Data from CoinCap API
    Logger.info({ message: "CoinCap Client: Fetching currency metadata from CoinCap API" });

    const REQUEST_URL = "https://api.coincap.io/v2/assets?limit=200";
    let response = await fetch(REQUEST_URL);
    if (response.ok && response.status === 200) {
      try {
        let jsonBody = await response.json();
        this.rawCurrencyDataFromCoinCap = jsonBody.data;
        return true;
      } catch (e) {
        Logger.error({
          message: "CoinCap Client: Failed to parse JSON response from CoinCap API",
          error: getErrorMessage(e),
        });
        return false;
      }
    }
    Logger.error({
      message: "CoinCap Client: Failed to fetch currency metadata from CoinCap API",
      status: response.status,
      statusText: response.statusText,
    });
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
