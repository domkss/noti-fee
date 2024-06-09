import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Class Name concatenation with tailwindMerge and clsx */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const getNetworkBaseName = (str: string) => {
  return str.indexOf("(") === -1 ? str : str.substring(0, str.indexOf("("));
};
