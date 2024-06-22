import { NextRequest, NextResponse } from "next/server";
import Mailer from "@/lib/service/Mailer";
import { FeeNotificationConfigSchema } from "@/lib/types/ZodSchemas";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { RateLimiter, RateLimiterType } from "@/lib/service/RateLimiter";

const POSTRequestIPRateLimiter = RateLimiter.getInstance(RateLimiterType.IP_POST, {
  windowSizeSec: 120,
  maxRequests: 5,
});

export const POST = RateLimiter.IPRateLimitedEndpoint(POSTRequestIPRateLimiter, async (req: NextRequest) => {
  try {
    const content = await req.json();
    const notificationConfig = FeeNotificationConfigSchema.parse(content);

    Mailer.sendVerificationEmail(notificationConfig);

    return Response.json({ message: "Email sent", status: HTTPStatusCode.OK });
  } catch (e) {
    return Response.json({ message: "Invalid request", status: HTTPStatusCode.BAD_REQUEST });
  }
});
