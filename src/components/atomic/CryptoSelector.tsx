"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utility/clientHelperFunctions";
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
    <div className={props.className}>
      <Combobox
        value={selected}
        onChange={(value) => {
          if (value) setSelected(value);
        }}
      >
        <div className="relative">
          <ComboboxInput
            className={cn(
              "text-balck w-full rounded-lg border py-2 pl-3 pr-8 text-sm/6",
              "data-[focus]:outline-balck/25 shadow-sm focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
            )}
            displayValue={(token: { name: string }) => token?.name || ""}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center justify-center px-2.5">
            <TokenIcon key={selected.id} symbol={selected.symbol} size={30} variant="branded" />
            <ChevronDownIcon className="pointer-events-none size-4 fill-black/60" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <ComboboxOptions
            anchor="bottom"
            className="z-10 w-[var(--input-width)] rounded-xl border border-gray-100 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
          >
            {filteredTokens.map((token) => (
              <ComboboxOption
                key={token.id}
                value={token}
                className="group flex cursor-default select-none items-center gap-2 rounded-lg bg-white px-3 py-1.5 data-[focus]:bg-black/10"
              >
                <TokenIcon key={token.id} symbol={token.symbol} size={30} variant="branded" />

                <div className="text-balck text-sm/6">{token.name}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
}

export default CryptoSelector;
