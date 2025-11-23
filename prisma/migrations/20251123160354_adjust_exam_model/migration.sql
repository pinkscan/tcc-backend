/*
  Warnings:

  - You are about to drop the column `etapaClassificacao` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `etapaDeteccao` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `externalUuid` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `s3ProcessedKey` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `s3RawKey` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `uuid` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "etapaClassificacao",
DROP COLUMN "etapaDeteccao",
DROP COLUMN "externalUuid",
DROP COLUMN "s3ProcessedKey",
DROP COLUMN "s3RawKey",
ADD COLUMN     "classify" JSONB,
ADD COLUMN     "detect" JSONB,
ADD COLUMN     "s3Processed" TEXT,
ADD COLUMN     "s3Raw" TEXT,
ADD COLUMN     "s3ResultJson" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "rawJson" DROP NOT NULL;
