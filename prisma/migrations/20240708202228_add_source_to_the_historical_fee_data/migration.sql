/*
  Warnings:

  - Added the required column `source` to the `HistoricalFeeData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoricalFeeData" ADD COLUMN     "source" TEXT NOT NULL;
