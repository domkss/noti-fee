import "server-only";
import { redirect } from "next/navigation";
import Image from "next/image";
import Stripe from "stripe";
import Logger from "@/lib/utility/Logger";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";
import PrismaInstance from "@/lib/service/PrismaInstance";

export default async function PaymentSuccessConfirmationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let redirect_JWT = null;

  try {
    if (searchParams?.payment_intent) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      let paymentIntent = await stripe.paymentIntents.retrieve(searchParams?.payment_intent);

      console.log(paymentIntent.status);

      if (paymentIntent?.status === "succeeded") {
        let prisma = await PrismaInstance.getInstance();
        let payment = await prisma.payment.findUnique({
          where: {
            id: paymentIntent.id,
          },
          include: {
            user: true,
          },
        });
        if (payment && payment.user && payment.paymentConfirmed === false) {
          await prisma.user.update({
            where: {
              email: payment.user.email,
            },
            data: {
              credit: payment.user.credit + 200,
            },
          });

          await prisma.payment.update({
            where: {
              id: paymentIntent.id,
            },
            data: {
              paymentConfirmed: true,
            },
          });

          redirect_JWT = payment.redirect_JWT;
        }
      }
    }
  } catch (e) {
    Logger.error({ message: "Error in payment success confirmation page", error: getErrorMessage(e) });
  }

  if (redirect_JWT) redirect(`/verify?token=${redirect_JWT}`);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <Image src="/icons/stripe_payment_logo.svg" width={280} height={280} alt="Stripe payment logo" />
      <div className="my-2 font-semibold text-red-500">Payment Failed</div>
    </div>
  );
}
