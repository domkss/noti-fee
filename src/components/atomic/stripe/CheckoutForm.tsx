import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { PaymentMethodCreateParams } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({ billingDetails }: { billingDetails: PaymentMethodCreateParams.BillingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: billingDetails,
        },
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    });

    if (result.error) {
      toast.error("Payment failed");
      setError(result.error.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
      {error && <div className="mt-5 text-center font-semibold text-red-500">{error}</div>}
    </form>
  );
};

export default CheckoutForm;
