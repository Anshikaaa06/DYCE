/*
  Warnings:

  - You are about to drop the column `accepted` on the `BlindDate` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `BlindDate` table. All the data in the column will be lost.
  - You are about to drop the column `revealed` on the `BlindDate` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `BlindDate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlindDate" DROP COLUMN "accepted",
DROP COLUMN "duration",
DROP COLUMN "revealed",
DROP COLUMN "startedAt",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "initiatorAgreeToReveal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiverAgreeToReveal" BOOLEAN NOT NULL DEFAULT false;
