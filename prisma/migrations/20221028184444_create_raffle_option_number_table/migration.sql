-- CreateEnum
CREATE TYPE "RaffleOptionIndicator" AS ENUM ('AVAILABLE', 'RESERVED', 'AWAITING_PAYMENT', 'OWNED');

-- CreateTable
CREATE TABLE "RaffleOptionNumber" (
    "id" CHAR(36) NOT NULL,
    "ownerId" CHAR(36),
    "raffleId" CHAR(36) NOT NULL,
    "num" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,
    "status" "RaffleOptionIndicator" NOT NULL DEFAULT 'AVAILABLE',
    "statusChangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RaffleOptionNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaffleOptionNumber" ADD CONSTRAINT "RaffleOptionNumber_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaffleOptionNumber" ADD CONSTRAINT "RaffleOptionNumber_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
