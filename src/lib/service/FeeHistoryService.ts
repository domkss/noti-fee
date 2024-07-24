import { PrismaClient } from "@prisma/client";
import PrismaInstance from "./PrismaInstance";
import BinanceClient from "../third_party/BinanceClient";
import Logger from "../utility/Logger";
import { SelectableExchanges } from "@/lib/utility/ClientHelperFunctions";
import { subWeeks, startOfWeek, endOfWeek, addDays, format } from "date-fns";
import { HistoricalFeeDataResponse } from "../types/TransferTypes";

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
        if (typeof fee.fee === "string") {
          const parsedValue = parseFloat(fee.fee);
          //Unable to convert value, continue
          if (isNaN(parsedValue)) {
            Logger.error({ message: `Unable to parse float from fee ${fee.fee}`, fee: fee });
            continue;
          }

          fee.fee = parsedValue;
        }

        if (typeof fee.feeInUSD === "string") {
          const parsedValue = parseFloat(fee.feeInUSD);
          //Unable to convert value, continue
          if (isNaN(parsedValue)) {
            Logger.error({ message: `Unable to parse float from fee ${fee.feeInUSD}`, fee: fee });
            continue;
          }

          fee.feeInUSD = parsedValue;
        }

        // Ensure the value is a number
        if (typeof fee.fee !== "number" || typeof fee.feeInUSD !== "number") continue;

        await FeeHistoryService.prisma.historicalFeeData.create({
          data: {
            currency: fee.coin,
            network: fee.network,
            fee: fee.fee,
            feeInUsd: fee.feeInUSD,
            source: SelectableExchanges.Binance_Withdrawal.id,
          },
        });
      }
      Logger.info({ message: "Save Current Fees to the historical data base", exchange: "Binance" });
    }
  }

  public async getLast10WeeklyAverages(currency: string, network: string): Promise<HistoricalFeeDataResponse> {
    const today = new Date();

    // Create an array to hold the weekly averages
    const weeklyAverages = [];

    // Loop for the last 10 weeks
    for (let i = 10; i > 0; i--) {
      // Calculate the start and end dates for each week
      const startDate = startOfWeek(subWeeks(today, i));
      const endDate = endOfWeek(subWeeks(today, i));

      // Fetch the feeInUsd values for the given week
      const fees = await FeeHistoryService.prisma.historicalFeeData.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          currency: currency,
          network: network,
        },
        select: {
          feeInUsd: true,
        },
      });

      // Calculate the weekly average
      const weeklySum = fees.reduce((sum, record) => sum + record.feeInUsd, 0);
      const weeklyAverage = fees.length ? weeklySum / fees.length : 0;

      //Get Midle of the week
      const middleOfTheWeekDateString = format(addDays(startDate, 3), "MMM/dd");

      // Add the weekly average to the array
      weeklyAverages.push({
        middleOfTheWeek: middleOfTheWeekDateString,
        averageFeeInUsd: weeklyAverage,
      });
    }

    return weeklyAverages;
  }
}

export default FeeHistoryService;
