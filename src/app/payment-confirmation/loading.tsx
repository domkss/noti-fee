import Spinner from "@/components/atomic/Spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Spinner className={"mt-2 flex items-center justify-center"} height="h-10" width="w-10" />
      <h1 className="text-lg font-semibold">Processing Payment</h1>
      <div>Please do not close this page, you will be redirected once the payment is confirmed.</div>
      <div className="mt-4 text-center">
        In case it takes longer than a few minutes and your purchased credit balance is not received in your account,
        <br />
        please contact our support at{" "}
        <a className="text-blue-500" href="mailto:contact@notifee.me">
          contact@notifee.me
        </a>
      </div>
    </div>
  );
}
