import "server-only";
import { FeeNotificationConfig } from "@/lib/types/TransferTypes";
import jwt from "jsonwebtoken";
import PrismaInstance from "@/lib/service/PrismaInstance";
import Logger from "@/lib/utility/Logger";
import { SelectableExchanges } from "@/lib/utility/ClientHelperFunctions";
import Mailer from "@/lib/service/Mailer";
import { FeeNotificationEmailData } from "@/lib/types/TransferTypes";
import { NetworkFeeDetail } from "@/lib/types/TransferTypes";
import { Notification, PrismaClient } from "@prisma/client";
import BinanceClient from "../third_party/BinanceClient";
import { CurrencyDetail } from "@/lib/types/TransferTypes";

export const getNotificationDataFromJWT = (token: string): Promise<FeeNotificationConfig> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(new Error("JWT_SECRET is not defined in the environment variables."));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        if (err?.name === "TokenExpiredError") {
          reject(new Error("Token has expired"));
        } else {
          reject(new Error("Invalid token"));
        }
      } else {
        resolve(decoded as FeeNotificationConfig);
      }
    });
  });
};

export const sendBinanceFeeNotifications = async () => {
  try {
    // Send notifications to users
    const binanceClient = await BinanceClient.getInstance();
    const prisma = await PrismaInstance.getInstance();
    if (!binanceClient || !prisma) {
      Logger.error({
        message: "Failed to SendBinanceFeeNotifications",
        error: "Failed to get instances of BinanceClient or PrismaInstance",
      });
      return;
    }

    Logger.info({ message: "Sending Binance fee notifications" });

    const withdrawalFees: CurrencyDetail[] = structuredClone(
      binanceClient.getCachedWithdrawalFees(),
    ) as CurrencyDetail[];

    // Get active Binance withdrawal notifications
    const activeBinanceNotifications = await prisma.notification.findMany({
      where: {
        exchange: SelectableExchanges.Binance_Withdrawal.id,
        sent: false,
      },
    });

    // Create a map of currency to networks for active notifications
    const activeNotificationCurrencyNetworksMap = activeBinanceNotifications.reduce(
      (
        acc: {
          [currency: string]: string[];
        },
        notification,
      ) => {
        if (!acc[notification.currency]) {
          acc[notification.currency] = [];
        }
        if (!acc[notification.currency].includes(notification.network))
          acc[notification.currency].push(notification.network);

        return acc;
      },
      {},
    );

    //Filter out the fee types that has no active notifications
    const withdrawalFeesWithActiveNotification = withdrawalFees
      .map((fee) => {
        if (activeNotificationCurrencyNetworksMap[fee.symbol]) {
          const networks = activeNotificationCurrencyNetworksMap[fee.symbol];
          fee.networkFees = fee.networkFees.filter((networkFee) => networks.includes(networkFee.network));
          if (fee.networkFees.length > 0) return fee;
        }
        return null;
      })
      .filter((fee): fee is NonNullable<typeof fee> => fee !== null);

    for (const notification of activeBinanceNotifications) {
      const currency = notification.currency;
      const network = notification.network;
      const fee = withdrawalFeesWithActiveNotification.find((fee) => fee.symbol === currency);
      if (!fee) {
        Logger.error({
          message: "Failed to SendBinanceFeeNotifications",
          error: `No fee data found for ${currency}`,
        });
        continue;
      }

      const networkFee = fee.networkFees.find((networkFee) => networkFee.network === network);
      if (!networkFee) {
        Logger.error({
          message: "Failed to SendBinanceFeeNotifications",
          error: `No network fee data found for ${currency} and ${network}`,
        });
        continue;
      }

      await sendFeeNotificationEmail(prisma, networkFee, notification);
    }
  } catch (error) {
    Logger.error({
      message: "Failed to SendBinanceFeeNotifications",
      error: error,
    });
  }
};

const sendFeeNotificationEmail = async (
  prisma: PrismaClient,
  networkFee: NetworkFeeDetail,
  notification: Notification,
) => {
  const feeInUSD = networkFee.feeInUSD;
  const feeInCoin = networkFee.fee;

  let currentFeeText;
  if (notification.targetCurrency === "USD" && feeInUSD <= notification.targetFee.toNumber()) {
    currentFeeText = feeInUSD.toFixed(2) + " " + notification.targetCurrency;
  } else if (notification.targetCurrency !== "USD" && feeInCoin <= notification.targetFee.toNumber()) {
    currentFeeText = feeInCoin + " " + notification.targetCurrency;
  } else return; // Do not send notification if the fee is not less than or equal to the target fee

  const targetFeeText = notification.targetFee.toNumber() + " " + notification.targetCurrency;

  const notificationData: FeeNotificationEmailData = {
    exchange: notification.exchange,
    currency: notification.currency,
    network: notification.networkName,
    targetFee: targetFeeText,
    currentFee: currentFeeText,
    email: notification.userEmail,
  };

  const result = await Mailer.sendFeeNotificationEmail(notificationData);

  if (result) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: { sent: true },
    });
    Logger.info({
      message: `Sent notification for target fee: ${targetFeeText} <= ${targetFeeText}`,
      notification: notification,
    });
  } else
    Logger.error({
      message: `Failed to send notification for USD target fee: ${feeInUSD} <= ${notification.targetFee.toNumber()} USD`,
      notification: notification,
    });
};
