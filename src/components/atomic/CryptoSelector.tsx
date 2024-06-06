"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/client/UIHelperFunctions";
import { useEffect, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TokenIcon } from "@token-icons/react";
import { CryptoTokken } from "@/lib/types/ClientTypes";

interface CryptoSelectorProps {
  className?: string;
  items: CryptoTokken[];
  selected?: CryptoTokken | null;
  onChange?: (token: CryptoTokken) => void;
}

function CryptoSelector(props: CryptoSelectorProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(props.selected || props.items[0]);

  useEffect(() => {
    props.onChange?.(selected);
  }, [selected, props.onChange, props]);

  const filteredTokens =
    query === ""
      ? props.items
      : props.items.filter((token) => {
          return token.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <Combobox
        value={selected}
        onChange={(value) => {
          if (value) setSelected(value);
        }}
      >
        <div className='relative'>
          <ComboboxInput
            className={cn(
              "w-full rounded-lg border p-3 pr-8 text-sm/6 text-balck",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-balck/25 shadow-sm"
            )}
            displayValue={(token: { name: string }) => token?.name || ""}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className='flex absolute inset-y-0 right-0 px-2.5 justify-center items-center'>
            <TokenIcon key={selected.id} symbol={selected.symbol} size={30} variant='branded' />
            <ChevronDownIcon className='pointer-events-none size-4 fill-black/60' aria-hidden='true' />
          </ComboboxButton>
        </div>
        <Transition
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() => setQuery("")}
        >
          <ComboboxOptions
            anchor='bottom'
            className='w-[var(--input-width)] rounded-xl border border-gray-100 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:hidden z-10'
          >
            {filteredTokens.map((token) => (
              <ComboboxOption
                key={token.id}
                value={token}
                className='group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 bg-white'
              >
                <TokenIcon key={token.id} symbol={token.symbol} size={30} variant='branded' />

                <div className='text-sm/6 text-balck'>{token.name}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
}

export default CryptoSelector;
