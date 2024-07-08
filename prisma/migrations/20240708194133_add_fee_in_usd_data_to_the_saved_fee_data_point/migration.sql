/*
  Warnings:

  - Added the required column `feeInUsd` to the `HistoricalFeeData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoricalFeeData" ADD COLUMN     "feeInUsd" DOUBLE PRECISION NOT NULL;
