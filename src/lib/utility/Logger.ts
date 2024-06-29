import "server-only";
import winston from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import moment from "moment-timezone";

const transports: winston.transport[] = [new winston.transports.Console()];
moment.tz.setDefault("Europe/Budapest");

if (process.env.NODE_ENV === "production") {
  const cloudWatchTransport = new WinstonCloudwatch({
    logGroupName: "Notifee-Backend-Logs",
    logStreamName: "Notifee-Backend-Logs-Stream",
    awsOptions: {
      credentials: {
        accessKeyId: process.env.CLOUD_WATCH_ACCESS_KEY!,
        secretAccessKey: process.env.CLOUD_WATCH_SECRET_KEY!,
      },
      region: process.env.AWS_REGION!,
    },
    jsonMessage: true,
  });
  transports.push(cloudWatchTransport);
}

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: () => moment().format("YYYY-MM-DD HH:mm:ss Z") }),
    winston.format.json(),
  ),
  transports: transports,
});

export default Logger;
