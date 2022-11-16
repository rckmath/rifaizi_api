/*
  Warnings:

  - The values [CPF] on the enum `PaymentSubType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentSubType_new" AS ENUM ('CPF_CNPJ', 'RANDOM_KEY', 'PHONE_NUMBER', 'EMAIL');
ALTER TABLE "PaymentOption" ALTER COLUMN "subType" TYPE "PaymentSubType_new" USING ("subType"::text::"PaymentSubType_new");
ALTER TYPE "PaymentSubType" RENAME TO "PaymentSubType_old";
ALTER TYPE "PaymentSubType_new" RENAME TO "PaymentSubType";
DROP TYPE "PaymentSubType_old";
COMMIT;
