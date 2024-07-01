import { NextRequest, NextResponse } from "next/server";
import Mailer from "@/lib/service/Mailer";
import { FeeNotificationConfigSchema } from "@/lib/types/ZodSchemas";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import { RateLimiter } from "@/lib/service/RateLimiter";
import PrismaInstance from "@/lib/service/PrismaInstance";
import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import { createUUID8 } from "@/lib/utility/UtilityFunctions";
import Logger from "@/lib/utility/Logger";
import { TEMPORARY_EMAIL_DOMAIN_BLOCK_LIST } from "@/lib/utility/ConstData";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("token");

  if (token) {
    return ActivateNotification(req, token);
  } else {
    return SendVerificationEmail(req);
  }
};

// Rate limiter for verification email request
const VerificationEmailRequestRateLimiterByIP = RateLimiter.getInstance({
  namspace: "limit_send_by_ip",
  windowSizeSec: 86400,
  maxRequests: 50,
});
//Rate limiter for verification email by email address
const VerificationEmailRequestRateLimiterByEmail = RateLimiter.getInstance({
  namspace: "limit_send_by_email",
  windowSizeSec: 86400,
  maxRequests: 5,
});
//Send verification email
const SendVerificationEmail = RateLimiter.IPRateLimitedEndpoint(
  VerificationEmailRequestRateLimiterByIP,
  async (req: NextRequest) => {
    try {
      const content = await req.json();
      const notificationConfig = FeeNotificationConfigSchema.parse(content);

      //Disallow temporary email addresses
      if (TEMPORARY_EMAIL_DOMAIN_BLOCK_LIST.includes(notificationConfig.email.split("@")[1])) {
        Logger.warn("Temporary email addresses are not allowed", { email: notificationConfig.email });
        return Response.json(
          { error: "Temporary email addresses are not allowed" },
          { status: HTTPStatusCode.BAD_REQUEST },
        );
      }

      //Generate a new UUID for each request
      notificationConfig.uuid = createUUID8(notificationConfig);

      //#region Email Rate Limiter
      let prisma = await PrismaInstance.getInstance();

      const user = await prisma.user.findUnique({
        where: {
          email: notificationConfig.email,
        },
      });

      let isRateLimited = await VerificationEmailRequestRateLimiterByEmail.isRateLimited(notificationConfig.email);

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
        } else {
          Logger.warn({
            message: "Rate limit reached for verification email sending with this email address",
            email: notificationConfig.email,
          });
          return Response.json(
            { error: "You have reached the rate limit. Please try again later." },
            { status: HTTPStatusCode.TOO_MANY_REQUESTS },
          );
        }
      }
      //#endregion

      let success = await Mailer.sendVerificationEmail(notificationConfig);
      if (success) {
        Logger.info({ message: "Verification email sent", email: notificationConfig.email });
        return Response.json({ message: "Email sent" }, { status: HTTPStatusCode.OK });
      } else {
        Logger.error({ message: "Failed to send verification email", email: notificationConfig.email });
        return Response.json({ error: "Failed to send email" }, { status: HTTPStatusCode.INTERNAL_SERVER_ERROR });
      }
    } catch (e) {
      Logger.error({ message: "Invalid request for verification email sending", error: getErrorMessage(e) });
      return Response.json({ error: "Invalid request" }, { status: HTTPStatusCode.BAD_REQUEST });
    }
  },
);

//Activate notification
const ActivateNotification: (req: NextRequest, token: string) => Promise<Response> = async (
  req: NextRequest,
  token: string,
) => {
  try {
    let decoded = await getNotificationDataFromJWT(token);
    let prisma = await PrismaInstance.getInstance();
    let user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (user && user.credit > 0 && typeof decoded.uuid === "string") {
      await prisma.$transaction(async (prisma) => {
        await prisma.notification.create({
          data: {
            id: decoded.uuid as string,
            userEmail: decoded.email,
            exchange: decoded.exchange,
            currency: decoded.currency,
            network: decoded.network,
            targetFee: decoded.targetFee,
            targetCurrency: decoded.targetCurrency,
          },
        });

        await prisma.user.update({
          where: {
            email: decoded.email,
          },
          data: {
            credit: user.credit - 1,
          },
        });
      });
      Logger.info({ message: "Notification activated", email: decoded.email, notificationId: decoded.uuid });
      return Response.json({ message: "Notification activated successfully" }, { status: HTTPStatusCode.OK });
    } else {
      Logger.error({ message: "Not enough credit to activate notification", email: decoded.email });
      return Response.json(
        { message: "You don't have enough credit to activate notification" },
        { status: HTTPStatusCode.PAYMENT_REQUIRED },
      );
    }
  } catch (e) {
    Logger.error({ message: "Invalid request for notification activation", error: getErrorMessage(e) });
    return Response.json({ message: "Token invalid or expired" }, { status: HTTPStatusCode.UNAUTHORIZED });
  }
};
