"use client";
import CryptoSelector from "@/components/atomic/CryptoSelector";
import { useEffect, useState } from "react";
import { CryptoTokken } from "@/lib/types/ClientTypes";
import { Description, Field, Fieldset, Input, Label, Legend, Select, Textarea } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/client/UIHelperFunctions";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<CryptoTokken | null>(null);

  const cryptoTokkens = [
    { id: 1, name: "Ethereum", symbol: "ETH" },
    { id: 2, name: "Bitcoin", symbol: "BTC" },
    { id: 3, name: "Ripple", symbol: "XRP" },
    { id: 4, name: "Litecoin", symbol: "LTC" },
    { id: 5, name: "Cardano", symbol: "ADA" },
    { id: 6, name: "Polkadot", symbol: "DOT" },
  ];

  useEffect(() => {
    console.log(selectedToken?.name);
  }, [selectedToken]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Fieldset className='space-y-6 rounded-xl bg-black/5 p-6 sm:p-10'>
        <Legend className='text-base/7 font-semibold text-black'>Get notified from withdrawal fee changes</Legend>

        <Field>
          <Label className='text-sm/6 font-medium text-black'>Select Currency</Label>
          <CryptoSelector
            items={cryptoTokkens}
            selected={selectedToken}
            onChange={(token) => setSelectedToken(token)}
          />
        </Field>
        <Field>
          <Label className='text-sm/6 font-medium text-black'>Select Network</Label>
          <CryptoSelector
            items={cryptoTokkens}
            selected={selectedToken}
            onChange={(token) => setSelectedToken(token)}
          />
        </Field>
        <Field>
          <Label className='text-sm/6 font-medium text-black'>Your Email Address</Label>
          <Input
            className={cn(
              "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            )}
          />
        </Field>
      </Fieldset>
    </main>
  );
}
