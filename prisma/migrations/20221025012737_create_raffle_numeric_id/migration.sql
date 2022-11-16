/*
  Warnings:

  - A unique constraint covering the columns `[numericId]` on the table `Raffle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN     "numericId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Raffle_numericId_key" ON "Raffle"("numericId");
