/*
  Warnings:

  - Added the required column `redirect_JWT` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "redirect_JWT" TEXT NOT NULL;
