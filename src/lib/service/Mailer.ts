import fs from "fs/promises";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Logger from "../utility/Logger";
import { FeeNotificationConfig } from "../types/TransferTypes";
import { getErrorMessage } from "../utility/UtilityFunctions";
import { getExchangeNameById } from "../utility/ClientHelperFunctions";
import { FeeNotificationEmailData } from "../types/TransferTypes";

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
      Logger.error({ message: "Nodemailer Configuration incorrect", severity: "Critical" });
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
    let data = await fs.readFile(emailTemplatePath, "utf-8").catch((e) => {
      Logger.error({ message: "Error reading email template", error: getErrorMessage(e), severity: "Critical" });
      return null;
    });
    const logoPath = "resources/email_templates/logo.png";
    let logoFile = await fs
      .readFile(logoPath)
      .catch((e) =>
        Logger.error({ message: "Error reading logo file", error: getErrorMessage(e), severity: "Critical" }),
      );

    if (!data || !logoFile) {
      return false;
    }

    const placeholders = {
      exchange: getExchangeNameById(notification.exchange) ?? notification.exchange,
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
      attachments: [
        {
          filename: "logo.png",
          content: logoFile,
          cid: "notifee-logo",
        },
      ],
    };

    if (process.env.NODE_ENV === "production") {
      try {
        let result = await transport.sendMail(mailOptions);
        Logger.info({
          message: "Sending verification email",
          verificationEmail: notification,
        });
        return true;
      } catch (error) {
        Logger.error({ message: "Failed to send verification email", error: getErrorMessage(error) });
        return false;
      }
    } else if (process.env.NODE_ENV === "development") {
      console.log(verificationLink);
    }
    return true;
  }

  static async sendFeeNotificationEmail(notification: FeeNotificationEmailData): Promise<boolean> {
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
      Logger.error({ message: "Nodemailer Configuration incorrect", severity: "Critical" });
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

    const emailTemplatePath = "resources/email_templates/fee_notification_email.html";
    let data = await fs.readFile(emailTemplatePath, "utf-8").catch((e) => {
      Logger.error({ message: "Error reading email template", error: getErrorMessage(e), severity: "Critical" });
      return null;
    });
    const logoPath = "resources/email_templates/logo.png";
    let logoFile = await fs
      .readFile(logoPath)
      .catch((e) =>
        Logger.error({ message: "Error reading logo file", error: getErrorMessage(e), severity: "Critical" }),
      );

    if (!data || !logoFile) {
      return false;
    }

    const placeholders = {
      exchange: getExchangeNameById(notification.exchange) ?? notification.exchange,
      currency: notification.currency,
      network: notification.network,
      target_fee: notification.targetFee,
      current_fee: notification.currentFee,
    };

    data = replacePlaceholders(data, placeholders);

    const mailOptions = {
      from: {
        address: from_email,
        name: from_email_name,
      },
      to: notification.email,
      subject: "Fee change notification",
      html: data,
      attachments: [
        {
          filename: "logo.png",
          content: logoFile,
          cid: "notifee-logo",
        },
      ],
    };

    if (process.env.NODE_ENV === "production") {
      try {
        let result = await transport.sendMail(mailOptions);
        Logger.info({
          message: "Sending notification email",
          verificationEmail: notification,
        });
        return true;
      } catch (error) {
        Logger.error({ message: "Failed to send notification email", error: getErrorMessage(error) });
        return false;
      }
    }
    return true;
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
