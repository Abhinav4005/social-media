-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('POST', 'COMMENT', 'USER', 'MESSAGE', 'GROUP', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'NUDITY', 'VIOLENCE', 'FALSE_INFO', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED', 'DISMISSED', 'ACTIONED');

-- CreateEnum
CREATE TYPE "ReportResolution" AS ENUM ('NO_ACTION', 'WARNING', 'CONTENT_REMOVED', 'USER_RESTRICTED', 'USER_BANNED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('BLUE_CHECK', 'GOV_ID', 'CREATOR');

-- CreateEnum
CREATE TYPE "RestrictionType" AS ENUM ('NO_POSTING', 'NO_COMMENTING', 'NO_MESSAGING', 'READ_ONLY', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AppealStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_BAN', 'USER_UNBAN', 'USER_RESTRICT', 'CONTENT_DELETE', 'REPORT_RESOLVE', 'VERIFICATION_APPROVE', 'VERIFICATION_REJECT', 'APPEAL_APPROVE', 'APPEAL_REJECT', 'POLICY_UPDATE');

-- AlterTable
ALTER TABLE "GroupPost" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRestricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "restrictionReason" TEXT,
ADD COLUMN     "verificationBadgeType" "VerificationType",
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- CreateTable
CREATE TABLE "PostViewHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostViewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" INTEGER NOT NULL,
    "reportedUserId" INTEGER,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolution" "ReportResolution" NOT NULL DEFAULT 'NO_ACTION',
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMute" (
    "id" SERIAL NOT NULL,
    "muterId" INTEGER NOT NULL,
    "mutedUserId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRestriction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "restrictionType" "RestrictionType" NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentModerationLog" (
    "id" SERIAL NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" INTEGER,
    "userId" INTEGER,
    "flagReason" TEXT NOT NULL,
    "toxicityScore" DOUBLE PRECISION,
    "spamScore" DOUBLE PRECISION,
    "actionTaken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuspiciousLoginLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "actionTaken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuspiciousLoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountVerificationRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "VerificationType" NOT NULL DEFAULT 'BLUE_CHECK',
    "documentType" TEXT,
    "documentUrl" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNotes" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountVerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationAppeal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reportId" INTEGER,
    "reason" TEXT NOT NULL,
    "evidence" TEXT,
    "status" "AppealStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNotes" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationAppeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityGuidelines" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityGuidelines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostViewHistory_userId_viewedAt_idx" ON "PostViewHistory"("userId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostViewHistory_userId_postId_key" ON "PostViewHistory"("userId", "postId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Report_reportedUserId_idx" ON "Report"("reportedUserId");

-- CreateIndex
CREATE INDEX "UserMute_muterId_idx" ON "UserMute"("muterId");

-- CreateIndex
CREATE INDEX "UserMute_mutedUserId_idx" ON "UserMute"("mutedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMute_muterId_mutedUserId_key" ON "UserMute"("muterId", "mutedUserId");

-- CreateIndex
CREATE INDEX "UserRestriction_userId_idx" ON "UserRestriction"("userId");

-- CreateIndex
CREATE INDEX "ContentModerationLog_contentType_contentId_idx" ON "ContentModerationLog"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "ContentModerationLog_userId_idx" ON "ContentModerationLog"("userId");

-- CreateIndex
CREATE INDEX "SuspiciousLoginLog_userId_idx" ON "SuspiciousLoginLog"("userId");

-- CreateIndex
CREATE INDEX "SuspiciousLoginLog_isFlagged_idx" ON "SuspiciousLoginLog"("isFlagged");

-- CreateIndex
CREATE INDEX "AccountVerificationRequest_userId_idx" ON "AccountVerificationRequest"("userId");

-- CreateIndex
CREATE INDEX "AccountVerificationRequest_status_idx" ON "AccountVerificationRequest"("status");

-- CreateIndex
CREATE INDEX "ModerationAppeal_userId_idx" ON "ModerationAppeal"("userId");

-- CreateIndex
CREATE INDEX "ModerationAppeal_status_idx" ON "ModerationAppeal"("status");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Post_category_idx" ON "Post"("category");

-- AddForeignKey
ALTER TABLE "PostViewHistory" ADD CONSTRAINT "PostViewHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostViewHistory" ADD CONSTRAINT "PostViewHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMute" ADD CONSTRAINT "UserMute_muterId_fkey" FOREIGN KEY ("muterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMute" ADD CONSTRAINT "UserMute_mutedUserId_fkey" FOREIGN KEY ("mutedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRestriction" ADD CONSTRAINT "UserRestriction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountVerificationRequest" ADD CONSTRAINT "AccountVerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAppeal" ADD CONSTRAINT "ModerationAppeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAppeal" ADD CONSTRAINT "ModerationAppeal_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
