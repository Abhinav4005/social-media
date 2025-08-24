/*
  Warnings:

  - You are about to drop the column `joindedAt` on the `RoomMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "lastMessage" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RoomMember" DROP COLUMN "joindedAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
