import fs from "fs/promises";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Logger from "../utility/Logger";
import { FeeNotification } from "../types/TransferTypes";

class Mailer {
  static async sendVerificationEmail(notification: FeeNotification) {
    const host = process.env.NODEMAILER_ENDPOINT;
    const port = process.env.NODEMAILER_PORT;
    const user = process.env.NODEMAILER_USER;
    const password = process.env.NODEMAILER_PASSWD;

    if (!host || !port || !user || !password) {
      Logger.error("NodeMailer Env configuration is incorrect");
      return;
    }

    var transport = nodemailer.createTransport({
      // @ts-ignore
      host: host,
      port: port,
      secure: port === "465",
      auth: {
        user: user,
        pass: password,
      },
    });

    const token = generateToken(notification);
    const verificationLink = `${process.env.SERVER_DOMAIN || "site-name"}/verify?token=${token}`;

    const emailTemplatePath = "resources/email_templates/enable_notification_email.html";
    let data = await fs.readFile(emailTemplatePath, "utf-8").catch(console.error);

    if (data) {
      const placeholders = {
        exchange: notification.exchange,
        currency: notification.currency,
        network: notification.network,
        target_fee: notification.targetFee,
        action_url: verificationLink,
      };

      data = replacePlaceholders(data, placeholders);

      const mailOptions = {
        from: {
          address: "noreply@sli.ink",
          name: "ShortLi",
        },
        to: notification.email,
        subject: "Enable NotiFee Notification",
        html: data,
      };
      console.log("Token: " + placeholders.action_url);
      /*transport.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          return logger.error(error);
        }
        logger.info("Verification email sent: Email= " + notification.email + " Info= " + info.response);
      });
      */
    }
  }
}

const generateToken = (notification: FeeNotification) => {
  if (process.env.JWT_SECRET) return jwt.sign(notification, process.env.JWT_SECRET, { expiresIn: "1h" });
  throw new Error("JWT_SECRET is not defined in the environment variables.");
};

const replacePlaceholders = (htmlContent: string, placeholders: { [key: string]: string }): string => {
  let updatedContent = htmlContent;
  for (const [placeholder, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`{{${placeholder}}}`, "g");
    updatedContent = updatedContent.replace(regex, value);
  }
  return updatedContent;
};

export default Mailer;
