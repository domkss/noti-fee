/*
  Warnings:

  - Changed the type of `source` on the `HistoricalFeeData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('binance_withdrawal');

-- AlterTable
ALTER TABLE "HistoricalFeeData" DROP COLUMN "source",
ADD COLUMN     "source" "SourceType" NOT NULL;
