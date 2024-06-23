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
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div
        style={{
          width: "400px",
          padding: "40px",
          borderRadius: "6px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h1 className="mb-10 text-center text-lg">Buy 200 Message Credit</h1>
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
    </div>
  );
};

export default StripeContainer;
