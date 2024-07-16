import cron from "node-cron";
import axios from "axios";
import { createHmac } from "crypto";
import "envkey";
import Logger from "./lib/Logger";

function startUpdateRequestingCron() {
  // Define the URL of your Next.js API endpoint
  const apiUrl: string = "http://notifee-app:3000/api/update"; // Replace with your actual API endpoint

  // Schedule a job to run every 5 minutes
  cron.schedule("*/10 * * * *", async () => {
    if (!process.env.UPDATE_ROUTE_SECRET) throw new Error("UPDATE_ROUTE_SECRET is not set");

    const requestTime = Date.now().toString();
    const signature = createHmac("sha256", process.env.UPDATE_ROUTE_SECRET).update(requestTime).digest("hex");

    axios
      .patch(
        apiUrl,
        {},
        {
          headers: {
            "x-request-time": requestTime,
            "x-signature": signature,
          },
        },
      )
      .then((response) => {
        Logger.info({ message: "Scheduler: Update request sent", data: response.data });
      })
      .catch((error) => {
        Logger.error({
          message: "Scheduler: Error sending the update request",
          error: error.response ? error.response.data : error.message,
        });
      });
  });

  Logger.info({ message: "Started: Scheduled update request job to run every 10 minutes." });
}

// Start the update scheduler
startUpdateRequestingCron();
