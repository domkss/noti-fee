import fs from "fs/promises";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import logger from "../utility/logger";

class Mailer {
  static async sendVerificationEmail(email: string) {
    const host = process.env.NODEMAILER_ENDPOINT;
    const port = process.env.NODEMAILER_PORT;
    const user = process.env.NODEMAILER_USER;
    const password = process.env.NODEMAILER_PASSWD;

    if (!host || !port || !user || !password) {
      logger.error("NodeMailer Env configuration is incorrect");
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

    const sender = {
      address: "noreply@sli.ink",
      name: "ShortLi",
    };

    const token = generateToken(email);
    const verificationLink = `http://your-domain.com/verify?token=${token}`;

    const mailOptions = {
      from: sender,
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking the link below:</p>
                 <a href="${verificationLink}">${verificationLink}</a>`,
    };

    transport.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        return logger.error(error);
      }
      logger.info("Verification email sent: " + info.response);
    });
  }
}

const generateToken = (email: string) => {
  if (process.env.JWT_SECRET) return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  throw new Error("JWT_SECRET is not defined in the environment variables.");
};

export default Mailer;
