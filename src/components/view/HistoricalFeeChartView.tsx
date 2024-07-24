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

    const dataBTC = HistoricalFeeResponseSchema.parse(responseBody.BTC);
    const dataETH = HistoricalFeeResponseSchema.parse(responseBody.ETH);

    const randomNumber = Math.random();

    let randomChoice = 0;
    if (randomNumber < 0.65) {
      randomChoice = 1;
    } else {
      randomChoice = 2;
    }

    switch (randomChoice) {
      case 1:
        setFeeData(dataBTC);
        break;
      case 2:
        setFeeData(dataETH);
        break;
      default:
        setFeeData(dataBTC);
        break;
    }

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
        label: "Binance Average Withdraw Fee " + feeData?.at(0)?.pair,
        data: feeData?.map((item) => item.averageFeeInUsd),
        backgroundColor: feeData?.at(0)?.pair.includes("BTC") ? "rgba(245, 97, 39, 0.5)" : "rgba(75, 192, 192, 0.2)",
        borderColor: feeData?.at(0)?.pair.includes("BTC") ? "rgba(245, 97, 39, 0.8)" : "rgba(75, 192, 192, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let label = tooltipItem.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (tooltipItem.raw !== undefined) {
              label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                tooltipItem.raw as number,
              );
            }
            return label;
          },
        },
      },
      legend: {
        position: "top",
        onClick: function (e, legendItem) {
          // Do nothing
        },
      },
      title: {
        display: true,
        text: "Historical Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value as number);
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
