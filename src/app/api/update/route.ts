import { NextRequest, NextResponse } from "next/server";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { createHmac } from "crypto";
import BinanceClient from "@/lib/third_party/BinanceClient";
import CoinCapClient from "@/lib/third_party/CoinCapClient";
import PrismaInstance from "@/lib/service/PrismaInstance";
import Logger from "@/lib/utility/Logger";
import { SelectableExchanges } from "@/lib/utility/ClientHelperFunctions";
import Mailer from "@/lib/service/Mailer";
import { FeeNotificationEmailData } from "@/lib/types/TransferTypes";
import { NetworkFeeDetail } from "@/lib/types/TransferTypes";
import { Notification, PrismaClient } from "@prisma/client";

// Cron job hook
export async function PATCH(req: NextRequest, res: NextResponse) {
  const currentTime = Date.now();
  const requestTime = parseInt(req.headers.get("x-request-time") || "0");
  const signature = req.headers.get("x-signature");

  if (!requestTime || !signature) {
    return Response.json({ message: "Bad Request", status: HTTPStatusCode.BAD_REQUEST });
  }

  const timeDifference = Math.abs(currentTime - requestTime);
  if (timeDifference > 30000) {
    return Response.json({ message: "Request timeout", status: HTTPStatusCode.REQUEST_TIMEOUT });
  }

  if (!process.env.UPDATE_ROUTE_SECRET) {
    return Response.json({ message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR });
  }

  // Verify the HMAC signature
  const expectedSignature = createHmac("sha256", process.env.UPDATE_ROUTE_SECRET)
    .update(requestTime.toString())
    .digest("hex");

  if (signature !== expectedSignature) {
    return Response.json({ message: "Unauthorized", status: HTTPStatusCode.UNAUTHORIZED });
  }

  // Update data from third-party APIs
  await BinanceClient.getInstance().then((client) => {
    if (client) client.refreshData();
  });
  await CoinCapClient.getInstance().then((client) => {
    if (client) client.refreshData();
  });

  // Send Binance fee notifications
  await sendBinanceFeeNotifications();

  return Response.json({ message: "Updated", status: HTTPStatusCode.OK });
}

async function sendBinanceFeeNotifications() {
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

    let withdrawalFees = binanceClient.getCachedWithdrawalFees();

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
    withdrawalFees = withdrawalFees
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
      const fee = withdrawalFees.find((fee) => fee.symbol === currency);
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
}

async function sendFeeNotificationEmail(
  prisma: PrismaClient,
  networkFee: NetworkFeeDetail,
  notification: Notification,
) {
  const feeInUSD = networkFee.feeInUSD;
  const feeInCoin = networkFee.fee;

  let currentFeeText;
  if (notification.targetCurrency === "USD" && feeInUSD <= notification.targetFee.toNumber()) {
    currentFeeText = feeInUSD + " " + notification.targetCurrency;
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
}
