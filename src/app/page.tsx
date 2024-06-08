"use client";
import CryptoSelector from "@/components/atomic/CryptoSelector";
import { useEffect, useState } from "react";
import { Description, Field, Fieldset, Input, Label, Legend, Select, Button } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utility/clientHelperFunctions";
import { ResponseCurrentFees } from "@/lib/types/TransferTypes";
import { CurrencyDetail } from "@/lib/types/TransferTypes";

export default function Home() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDetail | null>(null);
  const [supportedCurrenciesData, setSupportedCurrenciesData] = useState<CurrencyDetail[]>([]);

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
    console.log(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-l from-emerald-400/40 to-cyan-400/40">
      <Fieldset className="mt-16 min-w-[25%] space-y-6 rounded-xl border bg-gray-50/60 p-10 shadow-sm">
        <Legend className="text-center text-base/7 font-semibold text-black">
          Save big on exchange withdrawal fees
          <br />
          <div className="font-normal">Get notified when the price is right</div>
        </Legend>
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
            onChange={(currency) => setSelectedCurrency(currency)}
          />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Select Network</Label>
          <CryptoSelector
            className="mt-1"
            items={supportedCurrenciesData}
            selected={selectedCurrency}
            onChange={(currency) => setSelectedCurrency(currency)}
          />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Target Fee</Label>
          <Input
            className={cn(
              "mt-1 block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            )}
          />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-black">Your Email Address</Label>
          <Input
            className={cn(
              "mt-1 block w-full rounded-lg border bg-white px-3 py-1.5 text-sm/6 text-black shadow-sm",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            )}
          />
        </Field>
        <Field className="text-center">
          <Button className="mt-3 rounded bg-cyan-500 px-4 py-2 text-sm text-white data-[active]:bg-cyan-600 data-[hover]:bg-cyan-600">
            Notify Me
          </Button>
        </Field>
      </Fieldset>
    </main>
  );
}
