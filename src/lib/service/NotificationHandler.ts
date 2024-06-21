import { FeeNotification } from "@/lib/types/TransferTypes";
import jwt from "jsonwebtoken";

export const getNotificationDataFromJWT = (token: string): Promise<FeeNotification> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(new Error("JWT_SECRET is not defined in the environment variables."));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        if (err?.name === "TokenExpiredError") {
          reject(new Error("Token has expired"));
        } else {
          reject(new Error("Invalid token"));
        }
      } else {
        resolve(decoded as FeeNotification);
      }
    });
  });
};
