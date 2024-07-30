import FeeHistoryService from "@/lib/service/FeeHistoryService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const feeServiceInstance = await FeeHistoryService.getInstance();

  const avarageFeeBTCBTC = await feeServiceInstance.getLast10WeeklyAverages("BTC", "BTC");
  const avarageFeeETHETH = await feeServiceInstance.getLast10WeeklyAverages("ETH", "ETH");
  const avarageFeeSOLSOL = await feeServiceInstance.getLast10WeeklyAverages("SOL", "SOL");
  const avarageFeeUSDTETH = await feeServiceInstance.getLast10WeeklyAverages("USDT", "ETH");

  return Response.json({
    BTCBTC: avarageFeeBTCBTC,
    ETHETH: avarageFeeETHETH,
    SOLSOL: avarageFeeSOLSOL,
    USDTETH: avarageFeeUSDTETH,
  });
}

export const dynamic = "force-dynamic";
export const revalidate = 21600;
