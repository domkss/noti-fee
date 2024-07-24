import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/third_party/BinanceClient";
import { CurrencyDetail, ResponseCurrentFees } from "@/lib/types/TransferTypes";

export async function GET(req: NextRequest) {
  const binanceClient = await BinanceClient.getInstance();

  let currentFees: CurrencyDetail[] = [];
  if (binanceClient) currentFees = binanceClient.getCachedWithdrawalFees();

  let response: ResponseCurrentFees = {
    currentFees: currentFees,
  };

  return NextResponse.json(response);
}

export const dynamic = "force-dynamic";
