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

export default function Home() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDetail | null>(null);
  const [supportedCurrenciesData, setSupportedCurrenciesData] = useState<CurrencyDetail[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkFeeDetail | null>(null);
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

  useEffect(() => {
    getBinanceData();
  }, []);

  useEffect(() => {
    setSelectedNetwork(null);
  }, [selectedCurrency]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-l from-emerald-400/40 to-cyan-400/40">
      <Fieldset className="min-w-[25%] space-y-6 rounded-xl border bg-gray-50/60 p-10 shadow-sm max-sm:min-w-full">
        <Legend className="text-center text-base/7 font-semibold text-black">
          Save big on exchange withdrawal fees
          <br />
          <div className="font-normal">Get notified when the fee is right</div>
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
          <Description className="text-sm">Currently only Binance is supported.</Description>
          <div className="relative">
            <Select
              className={cn(
                "mt-3 block w-full appearance-none rounded-lg border-none bg-white px-3 py-2 text-sm/6 text-black",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                "*:text-black disabled:cursor-not-allowed disabled:bg-gray-200",
              )}
              disabled
            >
              <option value="binance">Binance</option>
              <option value="okx">OKX</option>
              <option value="bybit">Bybit</option>
              <option value="kraken">Kraken</option>
              <option value="coinbase">Coinbase</option>
              <option value="htx">HTX</option>
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
              parseUserTargetFeeInputAfterWait(e.target.value, currentFee).then((result: any) => {
                setTargetFee({ value: result.value, compatible: result.compatible });
              });
            }}
            placeholder={currentFee}
            className={cn(
              "mt-1 block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            )}
          />
          <div className="text-center text-sm/6 text-black">Current Withdrawal Fee: {currentFee}</div>
          <div className="text-center text-sm/6 text-black">
            Notify me when the fee is under:{" "}
            <span
              className={cn(
                "font-semibold",
                { "text-green-600": targetFee.compatible },
                { "text-red-600": targetFee.compatible === false },
              )}
            >
              {targetFee.compatible ? targetFee.value : targetFee.compatible === false ? "Invalid Target Fee" : "-"}
            </span>
          </div>
        </Field>

        <Field className="text-center">
          <Button className="mt-3 rounded bg-cyan-500 px-4 py-2 text-sm text-white data-[active]:bg-cyan-600 data-[hover]:bg-cyan-600">
            Set Up Notification
          </Button>
        </Field>
      </Fieldset>
    </main>
  );
}
