/*
  Warnings:

  - You are about to drop the column `ammount` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "ammount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;
