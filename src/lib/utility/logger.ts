import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

// Define a custom format for log messages
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = createLogger({
  level: "info", // Set the default logging level
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "logs/app.log" }), // Log to a file
  ],
});

export default logger;
