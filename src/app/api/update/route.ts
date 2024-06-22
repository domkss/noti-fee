import { NextRequest, NextResponse } from "next/server";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";

export async function PATCH(req: NextRequest, res: NextResponse) {
  // Cron job hook
  return Response.json({ message: "Updated", status: HTTPStatusCode.OK });
}
