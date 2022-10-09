-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'TO_DRAW', 'DRAWN', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PIX', 'BANK_ACCOUNT', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('COMMON', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(36) NOT NULL,
    "firebaseId" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" "UserRoleType" NOT NULL DEFAULT 'COMMON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raffle" (
    "id" CHAR(36) NOT NULL,
    "ownerId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "remindMe" BOOLEAN NOT NULL DEFAULT false,
    "status" "RaffleStatus" NOT NULL DEFAULT 'CREATED',
    "price" DECIMAL(10,2) NOT NULL,
    "fundingTarget" DECIMAL(10,2) NOT NULL,
    "optionsQty" INTEGER NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "prizeDrawAt" TIMESTAMP(3),
    "startParticipationDt" TIMESTAMP(3),
    "limitParticipationDt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Raffle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RafflePaymentOption" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "raffleId" CHAR(36) NOT NULL,
    "paymentOptionId" CHAR(36) NOT NULL,

    CONSTRAINT "RafflePaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOption" (
    "id" CHAR(36) NOT NULL,
    "ownerId" CHAR(36) NOT NULL,
    "key" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL DEFAULT 'PIX',
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Raffle" ADD CONSTRAINT "Raffle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RafflePaymentOption" ADD CONSTRAINT "RafflePaymentOption_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RafflePaymentOption" ADD CONSTRAINT "RafflePaymentOption_paymentOptionId_fkey" FOREIGN KEY ("paymentOptionId") REFERENCES "PaymentOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
