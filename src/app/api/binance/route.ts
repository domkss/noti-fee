"use server";
import { NextRequest, NextResponse } from "next/server";
import BinanceClient from "@/lib/server/BinanceClient";
import { mapToJson } from "@/lib/utility/helperFunctions";

export async function GET(req: NextRequest, res: NextResponse) {
  let binanceClient = BinanceClient.getInstance();
  let currentFees = binanceClient.getCachedWithdrawalFees();

  return Response.json({
    data: mapToJson(currentFees),
  });
}
