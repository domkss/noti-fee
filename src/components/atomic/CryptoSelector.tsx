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
import { TokenIcon, NetworkIcon } from "@token-icons/react";
import { CurrencyDetail, NetworkFeeDetail } from "@/lib/types/TransferTypes";
import { getNetworkBaseName } from "@/lib/utility/clientHelperFunctions";

type SelectorType = "currency" | "network";

interface CryptoSelectorProps {
  className?: string;
  items: CurrencyDetail[] | NetworkFeeDetail[];
  type: SelectorType;
  selected: CurrencyDetail | NetworkFeeDetail | null;
  disabled?: boolean;
  onChange?: (selected: CurrencyDetail | NetworkFeeDetail | null) => void;
}

function CryptoSelector(props: CryptoSelectorProps) {
  const [query, setQuery] = useState("");
  const selected: CurrencyDetail | NetworkFeeDetail = props.selected || { name: "", symbol: "", networkFees: [] };

  const filteredTokens =
    query === ""
      ? props.items
      : props.items.filter((token) => {
          return (
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol.toLowerCase().includes(query.toLowerCase())
          );
        });

  return (
    <div className={props.className}>
      <Combobox
        disabled={props.disabled}
        value={selected as CurrencyDetail}
        onChange={(value) => {
          if (value) props.onChange?.(value);
        }}
      >
        <div className="relative">
          <ComboboxInput
            className={cn(
              "text-balck w-full rounded-lg border py-2 pl-3 pr-8 text-sm/6",
              "data-[focus]:outline-balck/25 shadow-sm focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
            )}
            displayValue={(token: { name: string; symbol: string }) =>
              token.name.length > 0 ? token?.name + " (" + token?.symbol + ")" : null || ""
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center justify-center px-2.5">
            {selected?.symbol ? (
              <div className="rounded-full bg-emerald-100 shadow-md">
                {props.type === "currency" ? (
                  <TokenIcon key={selected.symbol} symbol={selected.symbol} size={32} variant="branded" />
                ) : (
                  <NetworkIcon
                    key={selected.symbol}
                    network={getNetworkBaseName(selected.name).trim()}
                    size={32}
                    variant="branded"
                  />
                )}
              </div>
            ) : null}
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
            {filteredTokens.map((item) => (
              <ComboboxOption
                key={item.symbol}
                value={item}
                className="group flex cursor-default select-none items-center gap-2 rounded-lg bg-white px-3 py-1.5 data-[focus]:bg-black/10"
              >
                {props.type === "currency" || getNetworkBaseName(item.name) === "" ? (
                  <TokenIcon key={item.symbol} symbol={item.symbol} size={32} variant="branded" />
                ) : (
                  <NetworkIcon key={item.symbol} network={getNetworkBaseName(item.name)} size={32} variant="branded" />
                )}

                <div className="text-balck text-sm/6">{item.name + " (" + item.symbol + ")"}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
}

export default CryptoSelector;
