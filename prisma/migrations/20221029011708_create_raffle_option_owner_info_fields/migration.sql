-- AlterTable
ALTER TABLE "RaffleOptionNumber" ADD COLUMN     "ownerName" VARCHAR(100),
ADD COLUMN     "ownerPhone" VARCHAR(15);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" VARCHAR(15);
