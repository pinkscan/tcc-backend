/*
  Warnings:

  - Made the column `rawJson` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "imagemTratadaBase64" TEXT,
ALTER COLUMN "rawJson" SET NOT NULL;
