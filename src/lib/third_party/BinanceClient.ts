import "server-only";
import { BINANCE_DUMMY_COIN_DATA } from "./_developer_data";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
import CoinCapClient from "./CoinCapClient";
import Logger from "../utility/Logger";
import crypto from "crypto";

class BinanceClient {
  private static instance: BinanceClient;

  private rawCurrencyDataFromBinance: { [key: string]: any }[] = [];

  private calculatedWithdrawalFees: CurrencyDetail[] = [];

  private constructor() {}

  public static async getInstance(): Promise<BinanceClient | null> {
    if (!this.instance) {
      let instance = new BinanceClient();

      let requestSuccessful = await instance.getCurrencyDataFromBinance();
      if (!requestSuccessful) {
        return null;
      }
      await instance.calculateWithdrawalFees();
      this.instance = instance;
    }

    return this.instance;
  }

  public getCachedWithdrawalFees(): CurrencyDetail[] {
    return this.calculatedWithdrawalFees;
  }

  private async calculateWithdrawalFees(): Promise<void> {
    this.calculatedWithdrawalFees = [];
    let coinCapClient = await CoinCapClient.getInstance();

    this.getSupportedCurrencies().map((currency) => {
      let networks = this.getSupportedNetworksOfCurrency(currency.symbol);
      let networkFeeArray: { name: string; network: string; fee: number; feeInUSD: number; coin: string }[] = [];

      networks.map(async (item: { name: string; network: string; coin: string }) => {
        let fee = this.getNetworkFeeForCurrency(currency.symbol, item.network);

        let feeInUSD = coinCapClient?.getUsdPriceBySymbol(currency.symbol) ?? 0;

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
      const rankA = coinCapClient?.getRankBySymbol(a.symbol) ?? Infinity;
      const rankB = coinCapClient?.getRankBySymbol(b.symbol) ?? Infinity;

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

  private async getCurrencyDataFromBinance(): Promise<boolean> {
    if (process.env.NODE_ENV === "development") {
      this.rawCurrencyDataFromBinance = BINANCE_DUMMY_COIN_DATA;
      return true;
    }

    //Get Data from Binance API
    Logger.info("Binance Client: Fetching currency data from Binance API.");

    // Get the server time
    const timestamp = await this.getBinanceServerTime();
    if (!timestamp) {
      Logger.error("Binance Client: Failed to get server time from Binance API.");
      return false;
    }

    const REQUEST_URL = "https://api.binance.com/sapi/v1/capital/config/getall";
    // Headers with API key
    const headers = {
      "X-MBX-APIKEY": process.env.BINANCE_API_KEY || "invalid",
    };
    // Set recvWindow
    const recvWindow = 5000; // 5000 milliseconds or 5 seconds

    // Create a query string for the request
    let queryString = `timestamp=${timestamp}&recvWindow=${recvWindow}`;

    // Generate the signature
    const signature = crypto
      .createHmac("sha256", process.env.BINANCE_SECRET_KEY || "invalid")
      .update(queryString)
      .digest("hex");

    // Add the signature to the query string
    queryString += `&signature=${signature}`;

    // Full URL with query string
    const requestUrl = `${REQUEST_URL}?${queryString}`;

    // Make the request
    const response = await fetch(requestUrl, {
      headers: headers,
    });

    if (!response.ok || response.status !== 200) {
      Logger.error("Binance Client: Failed to get currency data from Binance API.");
      return false;
    }

    const jsonResponse = await response.json();
    this.rawCurrencyDataFromBinance = jsonResponse;
    return true;
  }

  private async getBinanceServerTime(): Promise<number | null> {
    const REQUEST_URL = "https://api.binance.com/api/v3/time";
    const response = await fetch(REQUEST_URL);
    if (!response.ok) {
      return null;
    }

    const response_data = await response.json();

    if (!response_data.serverTime) {
      return null;
    }

    return response_data.serverTime;
  }
}

export default BinanceClient;
