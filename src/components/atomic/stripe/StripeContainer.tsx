// components/StripeContainer.tsx
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { StripeElementsOptions } from "@stripe/stripe-js";
import Spinner from "../Spinner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const StripeContainer = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div className="flex w-auto flex-col items-center justify-center rounded-lg bg-white p-10">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div>
          <Spinner className="mt-2 flex items-center justify-center" height="h-8" width="w-8" />
          <div className="text-center">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default StripeContainer;
