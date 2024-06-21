import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/third_party/BinanceClient";
import { CurrencyDetail, ResponseCurrentFees } from "@/lib/types/TransferTypes";

export async function GET(req: NextRequest, res: NextResponse) {
  let binanceClient = await BinanceClient.getInstance();

  let currentFees: CurrencyDetail[] = [];
  if (binanceClient) currentFees = binanceClient.getCachedWithdrawalFees();

  let response: ResponseCurrentFees = {
    currentFees: currentFees,
  };

  return Response.json(response);
}
