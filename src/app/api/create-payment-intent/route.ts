import Stripe from "stripe";
import { StatusCodes as HTTPStatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";
import { CustomerBillingSchema } from "@/lib/types/ZodSchemas";
import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import Logger from "@/lib/utility/Logger";
import PrismaInstance from "@/lib/service/PrismaInstance";
import { RateLimiter } from "@/lib/service/RateLimiter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PaymentIntentCreationRateLimiterByIP = RateLimiter.getInstance({
  namspace: "limit_payment_intent_by_ip",
  windowSizeSec: 86400,
  maxRequests: 25,
});

const PaymentIntentCreationRateLimiterByEmail = RateLimiter.getInstance({
  namspace: "limit_payment_intent_by_email",
  windowSizeSec: 86400,
  maxRequests: 8,
});

export const POST = RateLimiter.IPRateLimitedEndpoint(
  PaymentIntentCreationRateLimiterByIP,
  async (req: NextRequest) => {
    //Todo: Handle authorization and rate limiting
    const token = req.headers.get("token");
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: HTTPStatusCodes.UNAUTHORIZED });
    }
    //Get notification data from JWT, throw error if token is invalid
    let notificationData = await getNotificationDataFromJWT(token);

    try {
      const customerBillingData = await req
        .json()
        .then((data) => CustomerBillingSchema.parse(data.customerBillingData));

      //This is a simple check to ensure that the email in the notification data matches the email in the customer billing data
      if (notificationData.email !== customerBillingData.email) {
        Logger.error({
          message: "Email mismatch between notification data and customer billing data, during payment intent creation",
          email1: notificationData.email,
          email2: customerBillingData.email,
        });
        return Response.json({ error: "Unauthorized" }, { status: HTTPStatusCodes.UNAUTHORIZED });
      }

      //Rate limit payment intent creation by email
      let isRateLimited = await PaymentIntentCreationRateLimiterByEmail.isRateLimited(notificationData.email);
      if (isRateLimited) {
        Logger.error({ message: "Too many payment attempt", email: notificationData.email });
        return Response.json(
          { error: "Too many payment attempt. Try again later." },
          { status: HTTPStatusCodes.TOO_MANY_REQUESTS },
        );
      }

      let prisma = await PrismaInstance.getInstance();
      let user = await prisma.user.findUnique({
        where: {
          email: notificationData.email,
        },
      });

      //Create user if not exists
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: notificationData.email,
            firstName: customerBillingData.firstName,
            lastName: customerBillingData.lastName,
          },
        });
        if (!user) {
          Logger.error({
            message: "Failed to create user during payment intent creation",
            email: notificationData.email,
          });
          return Response.json({ error: "Internal Server Error" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
        }
      }

      //Get stripe customer id if exists or create a new customer

      if (user.stripeCustomerId) {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        if (!customer) {
          Logger.error({
            message: "Failed to retrieve stripe customer during payment intent creation",
            email: notificationData.email,
          });
          return Response.json({ error: "Internal Server Error" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
        }
      } else {
        const customer = await stripe.customers.create({
          email: customerBillingData.email,
          name: customerBillingData.firstName + " " + customerBillingData.lastName,
          address: {
            city: customerBillingData.city,
            country: customerBillingData.country,
            line1: customerBillingData.addressLine1,
            line2: customerBillingData.addressLine2,
            postal_code: customerBillingData.postalCode,
            state: customerBillingData.state,
          },
        });
        if (!customer) {
          Logger.error({
            message: "Failed to create stripe customer during payment intent creation",
            email: notificationData.email,
          });
          return Response.json({ error: "Internal Server Error" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
        }
        user = await prisma.user.update({
          where: {
            email: notificationData.email,
          },
          data: {
            stripeCustomerId: customer.id,
          },
        });
        if (!user.stripeCustomerId || user.stripeCustomerId !== customer.id) {
          Logger.error({
            message: "Failed to update stripe customer id during payment intent creation",
            email: notificationData.email,
          });
          return Response.json({ error: "Internal Server Error" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
        }
      }

      //Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 999, // amount in cents 9.99$
        currency: "usd",
        receipt_email: customerBillingData.email,
        customer: user.stripeCustomerId,
      });

      const customerIP =
        (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"))?.split(",").shift()?.trim() ?? "unkown";

      //Todo: Save user data in database, with payment intent id, and jwt token for redirecting to success page and creation timestasmp
      await prisma.payment.create({
        data: {
          id: paymentIntent.id,
          firstName: customerBillingData.firstName,
          lastName: customerBillingData.lastName,
          addressLine1: customerBillingData.addressLine1,
          addressLine2: customerBillingData.addressLine2,
          city: customerBillingData.city,
          state: customerBillingData.state,
          postalCode: customerBillingData.postalCode,
          country: customerBillingData.country,
          ipAddress: customerIP,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          user: {
            connect: {
              email: notificationData.email,
            },
          },
          redirect_JWT: token,
        },
      });

      return Response.json({ clientSecret: paymentIntent.client_secret }, { status: HTTPStatusCodes.OK });
    } catch (err) {
      Logger.error({ message: "Error during payment intent creation", error: getErrorMessage(err) });
      return Response.json({ error: "Internal Server Error" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
    }
  },
);
