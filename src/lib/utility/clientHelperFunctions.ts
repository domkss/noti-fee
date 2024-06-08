import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Class Name concatenation with tailwindMerge and clsx */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
