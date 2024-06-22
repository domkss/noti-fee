"use client";
import { FeeNotificationConfig } from "@/lib/types/TransferTypes";
import React from "react";
import { getExchangeNameById } from "@/lib/utility/ClientHelperFunctions";
import { TokenIcon, NetworkIcon } from "@token-icons/react";
import { getNetworkBaseName } from "@/lib/utility/ClientHelperFunctions";
import { cn } from "@/lib/utility/UtilityFunctions";
import { Field, Fieldset, Label, Button } from "@headlessui/react";

interface SetupVerificationFormProps {
  data: FeeNotificationConfig;
  availableCredit: number;
}

export default function SetupVerificationForm(props: SetupVerificationFormProps) {
  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="flex h-screen flex-1 flex-col text-lg">
        <div className="flex flex-col pt-10">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-1 flex-col p-2 text-center md:flex-row">
              <div className="font-bold">Email:</div>
              <div className="mx-2">{props.data.email}</div>
            </div>
            <div className="flex flex-1 flex-col p-2 text-center md:flex-row">
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
            <div className="flex flex-1 flex-col items-center p-2 text-center md:flex-row">
              <div className="mb-2 font-bold">Currency:</div>
              <div className="mb-2 flex flex-row items-center">
                <div className="ml-2">{props.data.currency}</div>
                <div className="ml-2 rounded-full bg-emerald-100 shadow-md">
                  <TokenIcon symbol={props.data.currency} size={30} variant="branded" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center p-2 text-center md:flex-row">
              <div className="mb-2 font-bold">Network:</div>
              <div className="mb-2 flex flex-row items-center">
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
            <div className="flex flex-1 flex-col p-2 text-center md:flex-row">
              <div className="font-bold">Exchange:</div>
              <div className="mx-2">{getExchangeNameById(props.data.exchange)}</div>
            </div>
            <div className="flex flex-1 flex-col p-2 text-center md:flex-row">
              <div className="font-bold">Target Fee:</div>
              <div className="mx-2">{props.data.targetFee}</div>
            </div>
          </div>
        </div>
        <Fieldset className="flex flex-col p-4">
          <Field className="text-center">
            <Button className="rounded-md bg-blue-500 px-3 py-2 text-white">Activate Notification</Button>
          </Field>
        </Fieldset>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
