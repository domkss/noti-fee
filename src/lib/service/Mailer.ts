import fs from "fs/promises";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Logger from "../utility/Logger";
import { FeeNotificationConfig } from "../types/TransferTypes";

class Mailer {
  static async sendVerificationEmail(notification: FeeNotificationConfig): Promise<boolean> {
    const mail_server_host = process.env.NODEMAILER_ENDPOINT;
    const mail_server_port = process.env.NODEMAILER_PORT;
    const mail_server_user = process.env.NODEMAILER_USER;
    const mail_server_password = process.env.NODEMAILER_PASSWD;
    const server_domain = process.env.SERVER_DOMAIN;
    const from_email = process.env.FROM_EMAIL;
    const from_email_name = process.env.FROM_EMAIL_NAME;

    if (
      !mail_server_host ||
      !mail_server_port ||
      !mail_server_user ||
      !mail_server_password ||
      !server_domain ||
      !from_email ||
      !from_email_name
    ) {
      Logger.error("NodeMailer Env configuration is incorrect");
      throw new Error("Configuration incorrect");
    }

    var transport = nodemailer.createTransport({
      // @ts-ignore
      host: mail_server_host,
      port: mail_server_port,
      secure: mail_server_port === "465",
      auth: {
        user: mail_server_user,
        pass: mail_server_password,
      },
    });

    const token = generateToken(notification);
    const verificationLink = `${server_domain}/verify?token=${token}`;

    const emailTemplatePath = "resources/email_templates/enable_notification_email.html";
    let data = await fs.readFile(emailTemplatePath, "utf-8").catch(console.error);

    if (data) {
      const placeholders = {
        exchange: notification.exchange,
        currency: notification.currency,
        network: notification.network,
        target_fee: notification.targetFee + " " + notification.targetCurrency,
        action_url: verificationLink,
      };

      data = replacePlaceholders(data, placeholders);

      const mailOptions = {
        from: {
          address: from_email,
          name: from_email_name,
        },
        to: notification.email,
        subject: "Enable NotiFee Notification",
        html: data,
      };
      Logger.info(
        "Verification email sent: " +
          Object.entries(notification)
            .map(([key, value]) => `${key}=${value}`)
            .join(" "),
      );

      console.log("Token: " + placeholders.action_url);

      return true;
      /*transport.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          Logger.error("Error sending verification email: " + error);
          return false;
        }
        Logger.info("Verification email sent: Email= " + notification.email + " Info= " + info.response);
      });
      */
    }
    return false;
  }
}

const generateToken = (notification: FeeNotificationConfig) => {
  if (process.env.JWT_SECRET)
    return jwt.sign(notification, process.env.JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === "development" ? "24h" : "2h",
    });
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
