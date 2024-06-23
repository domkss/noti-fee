import Stripe from "stripe";
import { StatusCodes as HTTPStatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // amount in cents
      currency: "usd",
      /*receipt_email: email,
      customer: {
        email: email, // Customer email for additional verification
        name: name, // Customer name (optional)
      },
    });
   

    return Response.json({ clientSecret: paymentIntent.client_secret }, { status: HTTPStatusCodes.OK });
     */
    return Response.json({ error: "Not implemented" }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
  } catch (err) {
    console.error(getErrorMessage(err));
    return Response.json({ error: getErrorMessage(err) }, { status: HTTPStatusCodes.INTERNAL_SERVER_ERROR });
  }
}
