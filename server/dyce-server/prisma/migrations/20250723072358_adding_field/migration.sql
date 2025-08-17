/*
  Warnings:

  - The `favoriteArtist` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connectionIntent" TEXT,
ADD COLUMN     "currentMood" TEXT,
DROP COLUMN "favoriteArtist",
ADD COLUMN     "favoriteArtist" TEXT[];
