import { z } from "zod";

export const EmailSchema = z
  .string()
  .regex(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "Invalid email address",
  );

export const FeeNotificationConfigSchema = z.object({
  uuid: z.string().uuid().nullish(),
  email: EmailSchema,
  exchange: z.string(),
  currency: z.string(),
  network: z.string(),
  targetFee: z.number(),
  targetCurrency: z.string(),
});

export const CustomerBillingSchema = z.object({
  email: EmailSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string(),
  city: z.string().min(1),
  state: z.string(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});
