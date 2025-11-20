-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('FRIENDS', 'FOLLOWERS', 'PUBLIC', 'PRIVATE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MessagePrivacy" AS ENUM ('PUBLIC', 'FRIENDS', 'FOLLOWERS', 'PRIVATE', 'CUSTOM');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Follower" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "PrivacyList" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivacyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyListMember" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivacyListMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPrivacySetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "defaultPostVisibility" "PostVisibility" NOT NULL DEFAULT 'FOLLOWERS',
    "defaultMessageSetting" "MessagePrivacy" NOT NULL DEFAULT 'FOLLOWERS',
    "allowFollowersToMessage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPrivacySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostPrivacy" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "visibility" "PostVisibility" NOT NULL,
    "customListId" INTEGER,

    CONSTRAINT "PostPrivacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBlock" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "blockedUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyListMember_listId_memberId_key" ON "PrivacyListMember"("listId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PostPrivacy_postId_key" ON "PostPrivacy"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_userId_blockedUserId_key" ON "UserBlock"("userId", "blockedUserId");

-- AddForeignKey
ALTER TABLE "PrivacyList" ADD CONSTRAINT "PrivacyList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyListMember" ADD CONSTRAINT "PrivacyListMember_listId_fkey" FOREIGN KEY ("listId") REFERENCES "PrivacyList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyListMember" ADD CONSTRAINT "PrivacyListMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivacySetting" ADD CONSTRAINT "UserPrivacySetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPrivacy" ADD CONSTRAINT "PostPrivacy_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPrivacy" ADD CONSTRAINT "PostPrivacy_customListId_fkey" FOREIGN KEY ("customListId") REFERENCES "PrivacyList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
