import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
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
