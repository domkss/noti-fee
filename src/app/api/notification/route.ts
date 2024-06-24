import { NextRequest, NextResponse } from "next/server";
import Mailer from "@/lib/service/Mailer";
import { FeeNotificationConfigSchema } from "@/lib/types/ZodSchemas";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { RateLimiter, RateLimiterType } from "@/lib/service/RateLimiter";
import PrismaInstance from "@/lib/service/PrismaInstance";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("token");

  if (token) {
    return Response.json({ message: "Invalid request" }, { status: HTTPStatusCode.NOT_IMPLEMENTED });
  } else {
    return SendVerificationEmail(req);
  }
};

// Rate limiter for verification email request
const VerificationEmailRequestIPRateLimiter = RateLimiter.getInstance(RateLimiterType.EMAIL_SEND_FROM_IP, {
  windowSizeSec: 86400,
  maxRequests: 50,
});

const EmailAddressLimiter = RateLimiter.getInstance(RateLimiterType.VERIFICATION_EMAIL, {
  windowSizeSec: 86400,
  maxRequests: 5,
});

//Send verification email
const SendVerificationEmail = RateLimiter.IPRateLimitedEndpoint(
  VerificationEmailRequestIPRateLimiter,
  async (req: NextRequest) => {
    try {
      const content = await req.json();
      const notificationConfig = FeeNotificationConfigSchema.parse(content);

      //#region Email Rate Limiter
      let prisma = await PrismaInstance.getInstance();

      const user = await prisma.user.findUnique({
        where: {
          email: notificationConfig.email,
        },
      });

      let isRateLimited = EmailAddressLimiter.isRateLimited(notificationConfig.email);

      if (isRateLimited) {
        if (user && user.credit > 1) {
          await prisma.user.update({
            where: {
              email: notificationConfig.email,
            },
            data: {
              credit: user.credit - 1,
            },
          });
        } else
          return NextResponse.json(
            { error: "You have reached the rate limit. Please try again later." },
            { status: HTTPStatusCode.TOO_MANY_REQUESTS },
          );
      }
      //#endregion

      Mailer.sendVerificationEmail(notificationConfig);

      return Response.json({ message: "Email sent", status: HTTPStatusCode.OK });
    } catch (e) {
      return Response.json({ message: "Invalid request", status: HTTPStatusCode.BAD_REQUEST });
    }
  },
);
