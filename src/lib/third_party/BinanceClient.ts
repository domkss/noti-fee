import "server-only";
import { BINANCE_DUMMY_COIN_DATA } from "./_developer_data";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
import CoinCapClient from "./CoinCapClient";
import Logger from "../utility/Logger";
import crypto from "crypto";
import { getErrorMessage } from "../utility/UtilityFunctions";

class BinanceClient {
  private static instance: BinanceClient;

  private rawCurrencyDataFromBinance: { [key: string]: any }[] = [];

  private calculatedWithdrawalFees: CurrencyDetail[] = [];

  private lastDataUpdateTimeStamp: number = 0;
  private readonly UPDATE_INTERVAL_MS = 300000;

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

  public async refreshData(): Promise<void> {
    let currentTime = Date.now();

    if (currentTime - this.lastDataUpdateTimeStamp < this.UPDATE_INTERVAL_MS) {
      Logger.info({ message: "Binance Client: Data is up to date." });
      return;
    }

    let requestSuccessful = await this.getCurrencyDataFromBinance();
    if (!requestSuccessful) {
      return;
    }

    await this.calculateWithdrawalFees();

    Logger.info({ message: "Binance Client: Data refreshed." });
  }

  public getCachedWithdrawalFees(): CurrencyDetail[] {
    return this.calculatedWithdrawalFees;
  }

  public getLastDataUpdateTimeStamp(): number {
    return this.lastDataUpdateTimeStamp;
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
        //If the fee is null, then the network is not supported
        if (fee === null) return;

        //Set the native network as the first element
        if (item.name.includes(currency.name)) {
          networkFeeArray.unshift({
            name: item.name,
            network: item.network,
            coin: item.coin,
            fee: fee,
            feeInUSD: feeInUSD,
          });
        } else {
          networkFeeArray.push({
            name: item.name,
            network: item.network,
            coin: item.coin,
            fee: fee,
            feeInUSD: feeInUSD,
          });
        }
      });

      //Only add the currency if it has at least one network
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

    //Keep only the top 100 market cap currency
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
            return parseFloat(network["withdrawFee"]);
          }
        }
      }
    }
    return null;
  }

  private async getCurrencyDataFromBinance(): Promise<boolean> {
    //Update Last Data Update Timestamp
    this.lastDataUpdateTimeStamp = Date.now();

    if (process.env.NODE_ENV === "development") {
      this.rawCurrencyDataFromBinance = BINANCE_DUMMY_COIN_DATA;
      return true;
    }

    //Get Data from Binance API
    Logger.info({ message: "Getting currency data from Binance API" });

    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET_KEY) {
      Logger.error({ message: "Binance API key or secret key is missing" });
      return false;
    }

    // Get the server time
    const timestamp = await this.getBinanceServerTime();
    if (!timestamp) {
      return false;
    }

    const REQUEST_URL = "https://api.binance.com/sapi/v1/capital/config/getall";
    // Headers with API key
    const headers = {
      "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
    };
    // Set recvWindow
    const recvWindow = 5000; // 5000 milliseconds or 5 seconds

    // Create a query string for the request
    let queryString = `timestamp=${timestamp}&recvWindow=${recvWindow}`;

    // Generate the signature
    const signature = crypto.createHmac("sha256", process.env.BINANCE_SECRET_KEY).update(queryString).digest("hex");

    // Add the signature to the query string
    queryString += `&signature=${signature}`;

    // Full URL with query string
    const requestUrl = `${REQUEST_URL}?${queryString}`;

    // Make the request
    const response = await fetch(requestUrl, {
      headers: headers,
    });

    if (!response.ok || response.status !== 200) {
      Logger.error({
        message: "Failed to get currency data from Binance API",
        status: response.status,
        data: await response.json(),
      });
      return false;
    }

    try {
      const jsonResponse = await response.json();
      this.rawCurrencyDataFromBinance = jsonResponse;
      return true;
    } catch (e) {
      Logger.error({ message: "Failed to parse currency data from Binance API", error: getErrorMessage(e) });
      return false;
    }
  }

  private async getBinanceServerTime(): Promise<number | null> {
    const REQUEST_URL = "https://api.binance.com/api/v3/time";
    const response = await fetch(REQUEST_URL);
    if (!response.ok) {
      Logger.error({
        message: "Failed to get server time from Binance API",
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const response_data = await response.json();

    if (!response_data.serverTime) {
      Logger.error({ message: "Failed to parse server time from Binance API" });
      return null;
    }

    return response_data.serverTime;
  }
}

export default BinanceClient;
