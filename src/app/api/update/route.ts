import { NextRequest, NextResponse } from "next/server";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { createHmac } from "crypto";
import BinanceClient from "@/lib/third_party/BinanceClient";
import CoinCapClient from "@/lib/third_party/CoinCapClient";
import { sendBinanceFeeNotifications } from "@/lib/service/NotificationHandler";
import FeeHistoryService from "@/lib/service/FeeHistoryService";
import Logger from "@/lib/utility/Logger";

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
  const coinCapClient = await CoinCapClient.getInstance();
  if (coinCapClient) {
    await coinCapClient.refreshData();
  }

  const binanceClient = await BinanceClient.getInstance();
  if (binanceClient) {
    Logger.info({
      message: "Before refreshData",
      fees: binanceClient?.getCachedWithdrawalFees(),
      time: binanceClient?.getLastDataUpdateTimeStamp(),
    });

    await binanceClient.refreshData();

    Logger.info({
      message: "After refreshData",
      fees: binanceClient?.getCachedWithdrawalFees(),
      time: binanceClient?.getLastDataUpdateTimeStamp(),
    });
  }

  // Send Binance fee notifications
  await sendBinanceFeeNotifications();

  Logger.info({
    message: "After Send Notifications",
    fees: binanceClient?.getCachedWithdrawalFees(),
    time: binanceClient?.getLastDataUpdateTimeStamp(),
  });

  await FeeHistoryService.getInstance()
    .then(async (instance) => {
      await instance.SaveFees();
    })
    .catch((e) =>
      Logger.error({
        message: "Unable to save current fees to the database",
        error: e,
      }),
    );

  return Response.json({ message: "Updated", status: HTTPStatusCode.OK });
}
