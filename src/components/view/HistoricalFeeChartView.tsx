import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { StatusCodes as HTTPStatusCodes } from "http-status-codes";
import { HistoricalFeeResponseSchema } from "@/lib/types/ZodSchemas";
import { HistoricalFeeDataResponse } from "@/lib/types/TransferTypes";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HistoricalFeeChartView() {
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false);
  const [feeData, setFeeData] = useState<HistoricalFeeDataResponse | null>(null);

  async function getHistoricalFeeData() {
    const response = await fetch("/api/historical-fee-data");
    if (!response || response.status !== HTTPStatusCodes.OK) {
      return;
    }

    const responseBody = await response.json();

    const data = HistoricalFeeResponseSchema.parse(responseBody);
    setFeeData(data);
    setReadyToDisplay(true);
  }

  useEffect(() => {
    getHistoricalFeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels: feeData?.map((item) => item.middleOfTheWeek),
    datasets: [
      {
        label: "Binance Withdraw BTC/BTC",
        data: feeData?.map((item) => item.averageFeeInUsd),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Historical Fee Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  if (!readyToDisplay) return null;

  return (
    <div className="flex max-h-[500px] w-full justify-center overflow-hidden">
      <Bar data={chartData} options={options} width={700} height={500} />
    </div>
  );
}
