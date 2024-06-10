import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { networks } from "@token-icons/core/metadata";
import { NetworkFeeDetail } from "../types/TransferTypes";

/* Class Name concatenation with tailwindMerge and clsx */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

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

  return selectedNetwork.fee.toString() + selectedNetwork.coin + feeInUSD;
};
