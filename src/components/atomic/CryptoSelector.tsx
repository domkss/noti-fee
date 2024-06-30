"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utility/UtilityFunctions";
import { useEffect, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TokenIcon, NetworkIcon } from "@token-icons/react";
import { CurrencyDetail, NetworkFeeDetail } from "@/lib/types/TransferTypes";
import { getNetworkBaseName } from "@/lib/utility/ClientHelperFunctions";
import { isCurrencyDetail } from "@/lib/types/TransferTypes";

interface CryptoSelectorProps {
  className?: string;
  items: CurrencyDetail[] | NetworkFeeDetail[];
  selected: CurrencyDetail | NetworkFeeDetail | null;
  disabled?: boolean;
  onChange?: (selected: CurrencyDetail | NetworkFeeDetail | null) => void;
}

function CryptoSelector(props: CryptoSelectorProps) {
  const [query, setQuery] = useState("");
  const selected: CurrencyDetail | NetworkFeeDetail = props.selected ?? { name: "", symbol: "", networkFees: [] };

  const filteredTokens =
    query === ""
      ? props.items
      : props.items.filter((token) => {
          return (
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            (isCurrencyDetail(token) && token.symbol.toLowerCase().includes(query.toLowerCase())) ||
            (!isCurrencyDetail(token) && token.network.toLowerCase().includes(query.toLowerCase()))
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
              "text-balck w-full rounded-lg border-2 border-gray-200 py-2 pl-3 pr-8 text-sm/6",
              "data-[focus]:outline-balck/25 shadow-sm focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
            )}
            displayValue={(token: { name: string; symbol?: string; network?: string }) =>
              token.name.length > 0 ? token?.name + " (" + (token?.symbol ?? token.network) + ")" : null || ""
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center justify-center px-2.5">
            <div className="mr-1 rounded-full bg-emerald-100 shadow-md">
              {isCurrencyDetail(selected) || getNetworkBaseName(selected.name) === "" ? (
                <TokenIcon
                  symbol={isCurrencyDetail(selected) ? selected.symbol : selected.network}
                  size={32}
                  variant="branded"
                />
              ) : (
                <NetworkIcon network={getNetworkBaseName(selected.name).trim()} size={32} variant="branded" />
              )}
            </div>

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
            {filteredTokens.map((item, key) => (
              <ComboboxOption
                key={key}
                value={item}
                className="group flex cursor-default select-none items-center gap-2 rounded-lg bg-white px-3 py-1.5 data-[focus]:bg-black/10"
              >
                {isCurrencyDetail(item) || getNetworkBaseName(item.name) === "" ? (
                  <div className="h-8 w-8">
                    <TokenIcon
                      key={key}
                      symbol={isCurrencyDetail(item) ? item.symbol : item.network}
                      size={32}
                      variant="branded"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8">
                    <NetworkIcon key={key} network={getNetworkBaseName(item.name)} size={32} variant="branded" />
                  </div>
                )}

                <div className="text-balck text-sm/6">
                  {item.name.replace(/^\w/, (c) => c.toUpperCase()) +
                    " (" +
                    (isCurrencyDetail(item) ? item.symbol : item.network) +
                    ")"}
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
}

export default CryptoSelector;
