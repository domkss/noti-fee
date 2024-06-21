// scheduler/scheduler.ts

import cron from "node-cron";
import axios from "axios";
import "envkey";

// Define the URL of your Next.js API endpoint
const apiUrl: string = process.env.API_URL || "http://localhost:3000/api/update-data"; // Replace with your actual API endpoint

// Schedule a job to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    // Make a POST request to your API endpoint
    const response = await axios.post(apiUrl);
    console.log("HTTP POST request sent to", apiUrl);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error making HTTP request:", (error as any).message);
  }
});

console.log("Scheduled job to run every 5 minutes.");
