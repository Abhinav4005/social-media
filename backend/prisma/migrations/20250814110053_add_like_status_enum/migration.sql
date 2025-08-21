-- CreateEnum
CREATE TYPE "LikeStatus" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "PostLike" ADD COLUMN     "status" "LikeStatus" NOT NULL DEFAULT 'DISLIKE';
