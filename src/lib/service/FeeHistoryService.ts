import { PrismaClient } from "@prisma/client";
import PrismaInstance from "./PrismaInstance";
import BinanceClient from "../third_party/BinanceClient";
import Logger from "../utility/Logger";

class FeeHistoryService {
  private static instance: FeeHistoryService;
  private static prisma: PrismaClient;

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new FeeHistoryService();
    }
    if (!this.prisma) {
      this.prisma = await PrismaInstance.getInstance();
    }

    return this.instance;
  }

  public async SaveFees() {
    const binanceClient = await BinanceClient.getInstance();
    if (binanceClient) {
      const currentFees = binanceClient?.getCachedWithdrawalFees();

      const networkFees = currentFees.map((fee) => fee.networkFees).flat();

      for (const fee of networkFees) {
        await FeeHistoryService.prisma.historicalFeeData.create({
          data: {
            currency: fee.coin,
            network: fee.network,
            fee: fee.fee,
            feeInUsd: fee.feeInUSD,
          },
        });
      }
      Logger.info({ message: "Save Current Fees to the historical data base", exchange: "Binance" });
    }
  }
}

export default FeeHistoryService;
