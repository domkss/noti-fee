"use server";
import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/server/BinanceClient";
import { CurrencyDetail, ResponseCurrentFees } from "@/lib/types/TransferTypes";

export async function GET(req: NextRequest, res: NextResponse) {
  let binanceClient = BinanceClient.getInstance();

  let currentFees: CurrencyDetail[] = [];
  if (binanceClient) currentFees = binanceClient.getCachedWithdrawalFees();

  let response: ResponseCurrentFees = {
    currentFees: currentFees,
  };

  return Response.json(response);
}