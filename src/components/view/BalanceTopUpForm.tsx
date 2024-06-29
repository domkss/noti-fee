import React from "react";
import { useState } from "react";
import StripeContainer from "../atomic/stripe/StripeContainer";
import Image from "next/image";
import { Field, Fieldset, Label, Input, Legend, Select, Description } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utility/UtilityFunctions";

export default function BalanceTopUpPage() {
  type Step = "billing" | "payment";
  const [currentStep, setCurrentStep] = useState<Step>("payment");
  const Pagination = ({ currentStep }: { currentStep: Step }) => {
    return (
      <div className="flex flex-col items-center justify-center space-x-4 md:flex-row">
        <div className="flex items-center">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep === "billing" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            1
          </div>
          <span className="ml-2">Billing Information</span>
        </div>
        <span className="invisible text-gray-400 md:visible">———</span>
        <div className="flex items-center">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep === "payment" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            2
          </div>
          <span className="ml-2">Payment</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="mb-3 text-center text-lg font-semibold text-blue-400">
        Top up your message credit balance to continue
      </div>
      <Pagination currentStep={currentStep} />
      {currentStep === "billing" ? (
        <div className="flex flex-col p-4 md:flex-row md:justify-center">
          <Fieldset className="rounded-xl sm:p-10 ">
            <div className="md:grid md:grid-cols-2 md:gap-x-6">
              {/* First Name */}
              <Field className="my-2 sm:flex sm:flex-col md:col-span-1">
                <Label className="text-sm/6 font-medium text-black">First Name</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
              {/* Last Name */}
              <Field className="my-2 sm:flex sm:flex-col md:col-span-1">
                <Label className="text-sm/6 font-medium text-black">Last Name</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
              {/* Street Address */}
              <Field className="my-2 sm:flex sm:flex-col md:col-span-2">
                <Label className="text-sm/6 font-medium text-black">Street address</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
              {/* Postal Code */}
              <Field className="my-2 sm:flex sm:flex-col md:col-span-1">
                <Label className="text-sm/6 font-medium text-black">Postal Code</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
              {/* State */}
              <Field className="my-2 sm:flex sm:flex-col md:col-span-1">
                <Label className="text-sm/6 font-medium text-black">State</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
              {/* Country */}
              <Field className="relative md:col-span-2">
                <Label className="text-sm/6 font-medium text-black">Country</Label>
                <Input
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  )}
                />
              </Field>
            </div>
            <div className="mt-6">
              <button className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Continue to Payment
              </button>
            </div>
          </Fieldset>
        </div>
      ) : (
        <div className="flex flex-col p-4 md:flex-row md:justify-center">
          <div className="m-2 w-full max-w-sm flex-1 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex justify-center text-lg font-semibold">
              <span>Buy 200 credit</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Original price</span>
                <span>$6,592.00</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Savings</span>
                <span>-$299.00</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Store Pickup</span>
                <span>$99</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>$799</span>
              </div>
            </div>
            <div className="mb-6 flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>$7,191.00</span>
            </div>
            <div className="mt-6 flex items-end justify-around justify-self-end">
              <p className="text-sm text-gray-600">
                Payment processed by{" "}
                <a href="#" className="text-blue-600">
                  Stripe
                </a>{" "}
                for{" "}
                <a href="#" className="text-blue-600">
                  NotiFee
                </a>
              </p>
              <Image src={"/icons/stripe_payment_logo.svg"} alt="Stripe undraw logo" width={75} height={75} />
            </div>
          </div>
          <div className="m-2 flex w-full max-w-sm flex-1 items-center justify-center rounded-lg bg-white shadow-sm">
            <StripeContainer />
          </div>
        </div>
      )}
    </div>
  );
}
