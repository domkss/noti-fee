"use client";
import { FeeNotificationConfig } from "@/lib/types/TransferTypes";
import React from "react";
import { getExchangeNameById } from "@/lib/utility/ClientHelperFunctions";
import { TokenIcon, NetworkIcon } from "@token-icons/react";
import { getNetworkBaseName } from "@/lib/utility/ClientHelperFunctions";
import { cn } from "@/lib/utility/UtilityFunctions";
import { Field, Fieldset, Legend, Button, Label, Description } from "@headlessui/react";
import Image from "next/image";
import StripeContainer from "../atomic/stripe/StripeContainer";

interface SetupVerificationFormProps {
  data: FeeNotificationConfig;
  availableCredit: number;
}

export default function SetupVerificationForm(props: SetupVerificationFormProps) {
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="container">
        <Fieldset className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <Legend className="flex flex-col items-center md:flex-row">
            <Image className="mr-3" src="/icons/favicon.svg" alt="logo" width={80} height={80} />
            <Field className="text-black max-sm:text-center">
              <Label className="font-semibold">NotiFee</Label>
              <Description>
                Activate your notification
                <br />
                Every activation will cost 1 message credit
              </Description>
            </Field>
          </Legend>

          <Field className="flex flex-col">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-1 flex-row p-1 ">
                <div className="font-bold">Email:</div>
                <div className="mx-2">{props.data.email}</div>
              </div>
              <div className="flex flex-1 flex-row p-1 ">
                <div className="font-bold">Available message credit:</div>
                <div
                  className={cn(
                    "mx-2",
                    { "font-semibold text-green-500": props.availableCredit >= 10 },
                    { "fonst font-semibold text-orange-400": props.availableCredit < 10 },
                    { "font-bold text-red-600": props.availableCredit <= 0 },
                  )}
                >
                  {props.availableCredit}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-1 flex-row items-center p-1">
                <div className="font-bold">Currency:</div>
                <div className="flex flex-row items-center">
                  <div className="ml-2">{props.data.currency}</div>
                  <div className="ml-2 rounded-full bg-emerald-100 shadow-md">
                    <TokenIcon symbol={props.data.currency} size={30} variant="branded" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-row items-center p-1 ">
                <div className="font-bold">Network:</div>
                <div className="flex flex-row items-center">
                  <div className="ml-2">{props.data.network}</div>
                  <div className="ml-2 rounded-full bg-emerald-100 shadow-md">
                    {getNetworkBaseName(props.data.network) ? (
                      <NetworkIcon network={getNetworkBaseName(props.data.network)} size={30} variant="branded" />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-1  flex-row p-1">
                <div className="font-bold">Exchange:</div>
                <div className="mx-2">{getExchangeNameById(props.data.exchange)}</div>
              </div>
              <div className="flex flex-1  flex-row p-1 ">
                <div className="font-bold">Target Fee:</div>
                <div className="mx-2">{props.data.targetFee}</div>
              </div>
            </div>
          </Field>
        </Fieldset>
        <div className="flex justify-center p-3">
          <Button className="rounded-md bg-emerald-500  px-3 py-2 text-white hover:bg-emerald-600 max-sm:w-full">
            Activate Notification (1 credit)
          </Button>
        </div>
      </div>
    </div>
  );
}
