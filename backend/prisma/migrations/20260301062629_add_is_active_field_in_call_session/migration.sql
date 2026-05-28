-- DropIndex
DROP INDEX "CallSession_roomId_status_idx";

-- AlterTable
ALTER TABLE "CallSession" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "CallSession_roomId_isActive_idx" ON "CallSession"("roomId", "isActive");
