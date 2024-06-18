import Mailer from "@/lib/service/Mailer";
import { NotificationType } from "@/lib/types/TransferTypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  let notification: NotificationType = {
    email: "notifee_dev.roster808@passmail.net",
    exchange: "Binance",
    currency: "Bitcoin (BTC)",
    network: "Bitcoin (BTC)",
    targetFee: "0.10 USD",
  };

  Mailer.sendVerificationEmail(notification);

  return NextResponse.json({ message: "Hello, World!" });
}
