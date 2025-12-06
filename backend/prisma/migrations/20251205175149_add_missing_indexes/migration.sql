-- CreateTable
CREATE TABLE "StoryFeed" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryFeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryFeed_userId_createdAt_idx" ON "StoryFeed"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "StoryFeed" ADD CONSTRAINT "StoryFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryFeed" ADD CONSTRAINT "StoryFeed_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
