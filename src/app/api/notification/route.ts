import { NextRequest, NextResponse } from "next/server";
import Mailer from "@/lib/service/Mailer";
import { FeeNotification } from "@/lib/types/TransferTypes";

export async function GET(req: NextRequest, res: NextResponse) {
  let notification: FeeNotification = {
    email: "notifee_dev.roster808@passmail.net",
    exchange: "Binance",
    currency: "Bitcoin (BTC)",
    network: "Bitcoin (BTC)",
    targetFee: "0.10 USD",
  };

  Mailer.sendVerificationEmail(notification);
  return Response.json("Hello World!");
}
