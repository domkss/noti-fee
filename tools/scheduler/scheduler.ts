// scheduler/scheduler.ts

import cron from "node-cron";
import axios from "axios";
import { createHmac } from "crypto";
import "envkey";

function startUpdateRequestingCron() {
  // Define the URL of your Next.js API endpoint
  const apiUrl: string = "http://localhost:3000/api/update"; // Replace with your actual API endpoint

  // Schedule a job to run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
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
        console.log(requestTime, ": Update request sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending the update request:", error.response ? error.response.data : error.message);
      });
  });

  console.log("Started: Scheduled update request job to run every 5 minutes.");
}

// Start the update scheduler
startUpdateRequestingCron();
