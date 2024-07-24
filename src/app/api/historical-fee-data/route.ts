import FeeHistoryService from "@/lib/service/FeeHistoryService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const feeServiceInstance = await FeeHistoryService.getInstance();

  const avarageFee = await feeServiceInstance.getLast10WeeklyAverages("BTC", "BTC");

  return Response.json(avarageFee);
}

export const dynamic = "force-dynamic";
