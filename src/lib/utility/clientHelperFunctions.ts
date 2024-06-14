import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { networks } from "@token-icons/core/metadata";
import { NetworkFeeDetail } from "../types/TransferTypes";
import leven from "leven";

/* Class Name concatenation with tailwindMerge and clsx */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  let result: any;

  function executedFunction(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        result = fn.apply(this, args);
        resolve(result);
      }, ms);
    });
  }

  executedFunction.cancel = function () {
    clearTimeout(timeoutId);
  };

  return executedFunction;
};

/* Network Base Name Mapping */
const nameMapping: { [key: string]: string } = {
  "manta network": "manta pacific",
  "zksync era": "zksync",
  "lightning network": "bitcoin",
  "avax c-chain": "avalanche",
  kavaevm: "kava",
  opbnb: "bnb smart chain",
  "asset hub": "polkadot",
  "bnb beacon chain": "bnb smart chain",
};

export const getNetworkBaseName = (inputName: string) => {
  let networkName =
    inputName.indexOf("(") === -1
      ? inputName.trim().toLowerCase()
      : inputName.substring(0, inputName.indexOf("(")).trim().toLowerCase();

  if (
    networks.find(
      (network) =>
        network.name.toLowerCase() === networkName ||
        network.shortname?.toLowerCase() === networkName ||
        network.variants.find((variant) => variant.toLowerCase() === networkName),
    )
  )
    return networkName;
  else {
    let mappedName: string = nameMapping[networkName] || "";
    return mappedName;
  }
};

export const getCurrentFeePlaceholder = (selectedNetwork: NetworkFeeDetail | null): string => {
  if (!selectedNetwork) return "";

  let feeInUSD = "";

  if (selectedNetwork.feeInUSD) {
    let str = selectedNetwork.feeInUSD.toString();

    let match = str.match(/^0\.0*[1-9]\d{0,1}|^[1-9]\d*\.\d{2}/);
    if (match) {
      feeInUSD = " (" + match[0] + " USD)";
    } else {
      feeInUSD = " (" + str + " USD)";
    }
  }

  return selectedNetwork.fee.toString() + " " + selectedNetwork.coin + feeInUSD;
};

/* Process the user target fee input, based on the suggestion */
const parseUserTargetFeeInput = (input: string, suggestion: string): { value: string; compatible: boolean } => {
  // Helper function to extract the currencies and their decimal places from the suggestion
  function extractCurrenciesAndDecimals(suggestion: string) {
    const regex = /(\d+(\.\d+)?)\s?(\w+)\s?\((\d+(\.\d+)?)\s?(\w+)\)/;
    const match = suggestion.match(regex);
    if (match) {
      const cryptoDecimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
      const fiatDecimals = match[4].includes(".") ? match[4].split(".")[1].length : 0;

      console.log(cryptoDecimals, fiatDecimals);
      return {
        cryptoCurrency: match[3],
        cryptoDecimals,
        fiatCurrency: match[6],
        fiatDecimals,
      };
    }
    return null;
  }

  // Custom function to correct the currency if it has a typo or partial match
  function correctCurrency(currency: string, currencies: string[]) {
    const threshold = 2; // Maximum allowable Levenshtein distance
    let closestCurrency = null;
    let minDistance = Infinity;

    for (const curr of currencies) {
      const distance = leven(currency, curr);
      if (distance < minDistance && distance <= threshold) {
        minDistance = distance;
        closestCurrency = curr;
      }
    }

    return closestCurrency;
  }

  function roundUp(value: number, decimals: number) {
    const factor = Math.pow(10, decimals);
    return (Math.ceil(value * factor) / factor).toFixed(decimals);
  }

  // Extract currencies and decimal places from the suggestion
  const currencyData = extractCurrenciesAndDecimals(suggestion);
  if (!currencyData) {
    return { value: input, compatible: false };
  }

  const { cryptoCurrency, cryptoDecimals, fiatCurrency, fiatDecimals } = currencyData;
  const currencies = [cryptoCurrency, fiatCurrency];
  const inputParts = input.trim().split(/\s+/);

  if (inputParts.length === 2) {
    const [value, currency] = inputParts;
    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      return { value: input, compatible: false };
    }

    const correctedCurrency = correctCurrency(currency, currencies);
    if (correctedCurrency) {
      const decimals = correctedCurrency === cryptoCurrency ? cryptoDecimals : fiatDecimals;
      const roundedValue = roundUp(parsedValue, decimals);
      return { value: `${roundedValue} ${correctedCurrency}`, compatible: true };
    } else {
      return { value: input, compatible: false };
    }
  } else if (inputParts.length === 1) {
    const value = inputParts[0];
    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      return { value: input, compatible: false };
    }

    // Infer the most probable currency and use corresponding decimal places
    if (value.includes(".")) {
      const roundedValue = roundUp(parsedValue, cryptoDecimals);
      return { value: `${roundedValue} ${cryptoCurrency}`, compatible: true };
    } else {
      const roundedValue = roundUp(parsedValue, fiatDecimals);
      return { value: `${roundedValue} ${fiatCurrency}`, compatible: true };
    }
  } else {
    return { value: input, compatible: false };
  }
};

export const parseUserTargetFeeInputAfterWait = debounce(parseUserTargetFeeInput, 3000);
