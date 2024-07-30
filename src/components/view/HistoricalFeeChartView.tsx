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
import { cn } from "@/lib/utility/UtilityFunctions";
import { FeeDataPairToChartColor } from "@/lib/utility/ClientHelperFunctions";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HistoricalFeeChartView() {
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false);
  const [feeData, setFeeData] = useState<HistoricalFeeDataResponse[]>([]);
  const [displayedFeeDataIndex, setDisplayedFeeDataIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  //Get data from the server
  async function getHistoricalFeeData() {
    const response = await fetch("/api/historical-fee-data");
    if (!response || response.status !== HTTPStatusCodes.OK) {
      return;
    }

    const responseBody = await response.json();

    const dataBTCBTC = HistoricalFeeResponseSchema.parse(responseBody.BTCBTC);
    const dataETHETH = HistoricalFeeResponseSchema.parse(responseBody.ETHETH);
    const dataSOLSOL = HistoricalFeeResponseSchema.parse(responseBody.SOLSOL);
    const dataUSDTETH = HistoricalFeeResponseSchema.parse(responseBody.USDTETH);
    setFeeData([dataBTCBTC, dataETHETH, dataUSDTETH, dataSOLSOL]);

    setReadyToDisplay(true);
  }

  //Init data request
  useEffect(() => {
    getHistoricalFeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Step carousel
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDisplayedFeeDataIndex((prevIndex) => (prevIndex + 1) % feeData.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [displayedFeeDataIndex, isHovered, feeData.length]);

  //Handle carousel dot click
  const handleDotClick = (index: number) => {
    setDisplayedFeeDataIndex(index);
  };

  const chartData = {
    labels: feeData[displayedFeeDataIndex]?.map((item) => item.middleOfTheWeek),
    datasets: [
      {
        label: "Binance Average Withdraw Fee " + feeData[displayedFeeDataIndex]?.at(0)?.pair,
        data: feeData[displayedFeeDataIndex]?.map((item) => item.averageFeeInUsd),
        backgroundColor:
          FeeDataPairToChartColor.get(feeData[displayedFeeDataIndex]?.at(0)?.pair ?? "")?.backgroundColor ??
          "rgba(75, 192, 192, 0.2)",
        borderColor:
          FeeDataPairToChartColor.get(feeData[displayedFeeDataIndex]?.at(0)?.pair ?? "")?.borderColor ??
          "rgba(75, 192, 192, 0.8)",
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

  //Display null until the chart is loaded
  if (!readyToDisplay) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="flex max-h-[500px] w-full justify-center overflow-hidden">
        <Bar
          className="cursor-pointer"
          data={chartData}
          options={options}
          width={700}
          height={500}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
      <div className="mt-4 text-center">
        {feeData.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "m-1 inline-block h-4 w-4 cursor-pointer rounded-full",
              displayedFeeDataIndex === index ? "bg-emerald-300" : "bg-slate-300/70",
            )}
          ></span>
        ))}
      </div>
    </div>
  );
}
