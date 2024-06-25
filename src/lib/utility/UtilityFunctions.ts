import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

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

export function createUUID8(Object: any) {
  if (!Object) throw new Error("Object is required to create a UUID v8");
  const content = JSON.stringify(Object);

  // Create a hash of the JWT to use in the UUID v8
  const hash = crypto.createHash("sha256").update(content).digest("hex");

  // Generate a custom UUID v8
  const uuidTemplate = "xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx";
  let i = 0;
  return uuidTemplate.replace(/[xy]/g, function (char) {
    const r = parseInt(hash[i++], 16);
    const v = char === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
