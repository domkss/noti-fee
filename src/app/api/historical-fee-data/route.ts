import FeeHistoryService from "@/lib/service/FeeHistoryService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const feeServiceInstance = await FeeHistoryService.getInstance();

  const avarageFeeBTC = await feeServiceInstance.getLast10WeeklyAverages("BTC", "BTC");
  const avarageFeeETH = await feeServiceInstance.getLast10WeeklyAverages("ETH", "ETH");

  return Response.json({ BTC: avarageFeeBTC, ETH: avarageFeeETH });
}

export const dynamic = "force-dynamic";
export const revalidate = 21600;
