import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/third_party/BinanceClient";
import { CurrencyDetail, ResponseCurrentFees } from "@/lib/types/TransferTypes";
import Logger from "@/lib/utility/Logger";

export async function GET(req: NextRequest) {
  const binanceClient = await BinanceClient.getInstance();

  let currentFees: CurrencyDetail[] = [];
  if (binanceClient) currentFees = binanceClient.getCachedWithdrawalFees();

  let response: ResponseCurrentFees = {
    currentFees: currentFees,
  };

  Logger.info({
    message: "API: Bincane endpoint revalidated.",
  });

  return NextResponse.json(response);
}

export const dynamic = "auto";
export const revalidate = 300;
