/*
  Warnings:

  - Added the required column `alias` to the `PaymentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `PaymentOption` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentSubType" AS ENUM ('CPF', 'RANDOM_KEY', 'PHONE_NUMBER', 'EMAIL');

-- AlterTable
ALTER TABLE "PaymentOption" ADD COLUMN     "alias" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "subType" "PaymentSubType";
