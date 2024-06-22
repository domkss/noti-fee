import { NextRequest, NextResponse } from "next/server";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { createHmac } from "crypto";
import BinanceClient from "@/lib/third_party/BinanceClient";
import CoinCapClient from "@/lib/third_party/CoinCapClient";

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

  // Update the data
  await BinanceClient.getInstance().then((client) => {
    if (client) client.refreshData();
  });
  await CoinCapClient.getInstance().then((client) => {
    if (client) client.refreshData();
  });

  return Response.json({ message: "Updated", status: HTTPStatusCode.OK });
}
