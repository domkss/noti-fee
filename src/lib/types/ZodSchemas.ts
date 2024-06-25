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
