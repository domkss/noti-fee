import { networks } from "@token-icons/core/metadata";
import { NetworkFeeDetail } from "../types/TransferTypes";
import leven from "leven";
import { debounce } from "./UtilityFunctions";

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
      const cryptoValue = parseFloat(match[1]);
      const fiatValue = parseFloat(match[4]);
      const cryptoDecimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
      const fiatDecimals = match[4].includes(".") ? match[4].split(".")[1].length : 0;

      return {
        cryptoCurrency: match[3],
        cryptoValue,
        cryptoDecimals,
        fiatCurrency: match[6],
        fiatValue,
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

  const { cryptoCurrency, cryptoValue, cryptoDecimals, fiatCurrency, fiatValue, fiatDecimals } = currencyData;
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
    if (parsedValue * (fiatValue / cryptoValue) < Math.abs(parsedValue - fiatValue)) {
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

export const parseUserTargetFeeInputAfterWait = debounce(parseUserTargetFeeInput, 2000);

export const SelectableExchanges = {
  Binance_Withdrawal: { id: "binance_withdrawal", name: "Binance (Withdrawal)" },
  Okx_Withdrawal: { id: "okx_withdrawal", name: "OKX (Withdrawal)" },
  Bybit_Withdrawal: { id: "bybit_withdrawal", name: "Bybit (Withdrawal)" },
  Kraken_Withdrawal: { id: "kraken_withdrawal", name: "Kraken (Withdrawal)" },
  Coinbase_Withdrawal: { id: "coinbase_withdrawal", name: "Coinbase (Withdrawal)" },
  Htx_Withdrawal: { id: "htx_withdrawal", name: "HTX (Withdrawal)" },
} as const;

export function getExchangeNameById(id: string): string | undefined {
  for (const key in SelectableExchanges) {
    if ((SelectableExchanges as { [key: string]: { id: string; name: string } })[key].id === id) {
      return (SelectableExchanges as { [key: string]: { id: string; name: string } })[key].name;
    }
  }
  return undefined; // Return undefined if no match is found
}

export const FeeDataPairToChartColor = new Map([
  ["BTC/BTC", { backgroundColor: "rgba(245, 97, 39, 0.5)", borderColor: "rgba(245, 97, 39, 0.8)" }],
  ["ETH/ETH", { backgroundColor: "rgba(17, 178, 232, 0.3)", borderColor: "rgba(17, 178, 232, 0.8)" }],
  ["SOL/SOL", { backgroundColor: "rgba(158, 16, 232, 0.3)", borderColor: "rgba(158, 16, 232, 0.8)" }],
  ["USDT/ETH", { backgroundColor: "rgba(45, 232, 16, 0.35)", borderColor: "rgba(45, 232, 16, 0.8)" }],
]);
