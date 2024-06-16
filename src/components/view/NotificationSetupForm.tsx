"use client";
import CryptoSelector from "@/components/atomic/CryptoSelector";
import { useEffect, useState } from "react";
import { Description, Field, Fieldset, Input, Label, Legend, Select, Button } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utility/clientHelperFunctions";
import { NetworkFeeDetail, ResponseCurrentFees } from "@/lib/types/TransferTypes";
import { CurrencyDetail } from "@/lib/types/TransferTypes";
import { getCurrentFeePlaceholder } from "@/lib/utility/clientHelperFunctions";
import { parseUserTargetFeeInputAfterWait } from "@/lib/utility/clientHelperFunctions";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import Spinner from "../atomic/Spinner";

export default function NotificationSetupForm() {
  const [supportedCurrenciesData, setSupportedCurrenciesData] = useState<CurrencyDetail[]>([]);

  const [userEmail, setUserEmail] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDetail | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkFeeDetail | null>(null);
  const [inputCorrectionInProgress, setInputCorrectionInProgress] = useState(false);

  const [targetFee, setTargetFee] = useState<{ value: string; compatible: boolean | null }>({
    value: "",
    compatible: null,
  });

  let currentFee = getCurrentFeePlaceholder(selectedNetwork);

  const getBinanceData = async () => {
    let response = await fetch("/api/binance");
    let data: ResponseCurrentFees = await response.json();

    if (data.currentFees) {
      setSupportedCurrenciesData(data.currentFees);
    }
  };

  //Get Data on page load
  useEffect(() => {
    getBinanceData();
  }, []);

  //Reset network when currency changes
  useEffect(() => {
    setSelectedNetwork(null);
  }, [selectedCurrency]);

  return (
    <Fieldset className="min-w-[35%] space-y-6 border-r bg-slate-50/60 p-10 shadow-sm max-md:min-w-full max-sm:pt-2 md:px-16">
      <Legend className="flex flex-col items-center md:flex-row">
        <Image className="mr-3" src="/icons/favicon.svg" alt="logo" width={80} height={80} />
        <div className="text-center text-base/7 font-semibold text-black">
          <div>Save on exchange withdrawal fees</div>
          <div className=" font-normal">Get notified when the transaction fee is right</div>
        </div>
      </Legend>
      <Field>
        <Label className="text-sm/6 font-medium text-black">Your Email Address</Label>
        <Input
          className={cn(
            "mt-1 block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
          )}
        />
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-black">Select Exchange</Label>
        <Description className="text-sm">
          Currently, notifications are only supported for Binance withdrawal fees.
        </Description>
        <div className="relative">
          <Select
            className={cn(
              "mt-3 block w-full appearance-none rounded-lg border-none bg-white px-3 py-2 text-sm/6 text-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              "shadow-sm *:text-black disabled:cursor-not-allowed disabled:bg-gray-200",
            )}
            disabled
          >
            <option value="binance">Binance (Withdrawal)</option>
            <option value="okx">OKX (Withdrawal)</option>
            <option value="bybit">Bybit (Withdrawal)</option>
            <option value="kraken">Kraken (Withdrawal)</option>
            <option value="coinbase">Coinbase (Withdrawal)</option>
            <option value="htx">HTX (Withdrawal)</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-black/60"
            aria-hidden="true"
          />
        </div>
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-black">Select Currency</Label>
        <CryptoSelector
          className="mt-1"
          items={supportedCurrenciesData}
          selected={selectedCurrency}
          onChange={(currency) => setSelectedCurrency(currency as CurrencyDetail)}
        />
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-black">Select Network</Label>
        <CryptoSelector
          className="mt-1"
          items={selectedCurrency?.networkFees ?? []}
          selected={selectedNetwork}
          onChange={(network) => setSelectedNetwork(network as NetworkFeeDetail)}
        />
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-black">Target Fee</Label>
        <Input
          type="text"
          value={targetFee.value}
          onChange={(e) => {
            setTargetFee({ value: e.target.value, compatible: null });
            setInputCorrectionInProgress(true);
            parseUserTargetFeeInputAfterWait(e.target.value, currentFee).then((result: any) => {
              setTargetFee({ value: result.value, compatible: result.compatible });
              setInputCorrectionInProgress(false);
            });
          }}
          placeholder={currentFee}
          className={cn(
            "mt-1 block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            { "border-2 border-red-600": targetFee.compatible === false },
          )}
        />
      </Field>
      <Field>
        <div className="mt-2 text-center text-xl text-black">Notify me when the fee drops below:</div>

        <div
          className={cn(
            "text-center text-xl",
            { "font-semibold text-green-600": targetFee.compatible },
            { "text-red-600": targetFee.compatible === false },
            { hidden: inputCorrectionInProgress },
          )}
        >
          {targetFee.compatible
            ? targetFee.value
            : targetFee.compatible === false
              ? "Invalid target value"
              : "xxx USD/BTC/ETH/..."}
        </div>
        <Spinner
          className={cn("mt-2 flex items-center justify-center", { hidden: !inputCorrectionInProgress })}
          height="h-8"
          width="w-8"
        />
      </Field>
      <Field className="text-center">
        <Button
          className={cn(
            "text-md mt-3 rounded bg-emerald-500 px-4 py-2 text-white data-[active]:bg-emerald-600 data-[hover]:bg-emerald-600",
            {
              "bounce-and-shake cursor-not-allowed bg-red-500 data-[active]:bg-red-500 data-[hover]:bg-red-500":
                targetFee.compatible !== true && !inputCorrectionInProgress,
            },
            {
              "bounce-and-shake cursor-not-allowed bg-slate-400 data-[active]:bg-slate-500 data-[hover]:bg-slate-500":
                inputCorrectionInProgress,
            },
          )}
          onClick={() => {
            if (targetFee.compatible && !inputCorrectionInProgress) {
              //Post data to server
            } else if (targetFee.compatible === null && !inputCorrectionInProgress) {
              setTargetFee({ value: "", compatible: false });
            }
          }}
        >
          Set Up Notification
        </Button>
      </Field>
    </Fieldset>
  );
}
