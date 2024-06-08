"use server";
import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/server/BinanceClient";
import { ResponseCurrentFees } from "@/lib/types/TransferTypes";

export async function GET(req: NextRequest, res: NextResponse) {
  let binanceClient = BinanceClient.getInstance();
  let currentFees = binanceClient.getCachedWithdrawalFees();

  let response: ResponseCurrentFees = {
    currentFees: currentFees,
  };

  return Response.json(response);
}
